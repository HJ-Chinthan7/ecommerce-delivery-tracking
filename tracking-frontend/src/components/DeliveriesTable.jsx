import React, { useEffect, useState, useMemo } from "react";
import RightPanel from "./RightPanel";
import ParcelList from "./ParcelList";
import VerifyModal from "./VerifyModal";
import ConfirmModal from "./ConfirmModal";
import { driverParcelsAPI } from "../services/api";

const DeliveriesTable = ({ busId }) => {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [verifyModal, setVerifyModal] = useState({ show: false, parcel: null, action: "" ,email:""});
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    if (!busId) return;
    fetchParcels(busId);
  }, [busId]);

  const fetchParcels = async (id = busId) => {
    try {
      setLoading(true);
      const { data } = await driverParcelsAPI.getBusParcels(id);
      const fetchedParcels = data?.parcels || [];
      setParcels(fetchedParcels);

      const userIds = Array.from(new Set(fetchedParcels.map((p) => p.user).filter(Boolean)));
      if (userIds.length) {
        const usersRes = await driverParcelsAPI.getUsersBatch(userIds);
        const usersInfo =  usersRes?.data?.data || [];
        const map = {};
        usersInfo.forEach((u) => (map[u._id] = u));
        setUsers(map);
      } else {
        setUsers({});
      }
    } catch (err) {
      console.error("Error loading parcels:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = useMemo(() => {
    if (!searchQuery?.trim()) return parcels;
    const q = searchQuery.toLowerCase();
    return parcels.filter((p) => {
      const user = users?.[p.user];
      const addr = p?.shippingAddress || {};
      const product = p?.items?.[0]?.name || "";
      return (
        (addr.city || "").toLowerCase().includes(q) ||
        (addr.address || "").toLowerCase().includes(q) ||
        (addr.district || "").toLowerCase().includes(q) ||
        (addr.postalCode || "").toLowerCase().includes(q) ||
        (user?.username || "").toLowerCase().includes(q) ||
        (user?.email || "").toLowerCase().includes(q) ||
        (product || "").toLowerCase().includes(q) ||
        (p?.trackingId || "").toLowerCase().includes(q)
      );
    });
  }, [searchQuery, parcels, users]);

  const activeParcel = useMemo(() => {//eslint-disable-line
    if (!selectedParcel) return null;
    return parcels.find((p) => p._id === selectedParcel) || null;
  }, [selectedParcel, parcels]);

  const openDeliveryFlow = async ({parcel,userInfo}) => {
    try {
      const res = await driverParcelsAPI.generateDeliveryCode(parcel._id);
      const codeId = res?.codeId;
      setVerifyModal({ show: true, parcel: { ...parcel, codeId }, action: "deliver" ,email:userInfo?.email});
    } catch (err) {
      console.error("generateDeliveryCode failed", err);
      alert("Failed to request delivery OTP.");
    }
  };
  const openRemoveFlow = async (parcel) => {
    try {
      const res = await driverParcelsAPI.generateRemoveCode(parcel._id);
      const codeId = res?.codeId || res?.data?.codeId || (res?.data && res.data.codeId);
      setVerifyModal({ show: true, parcel: { ...parcel, codeId }, action: "remove" });
    } catch (err) {
      console.error("generateRemoveCode failed", err);
      alert("Failed to request admin OTP for remove.");
    }
  };

  const openRemoveBulkFlow = async () => {
    try {
      if (searchQuery?.trim()) {
        const parcelIds = filteredParcels.map((p) => p._id);
        const res = await driverParcelsAPI.generateCode({ type: "remove_selected", parcelIds });
        const codeId = res?.codeId || res?.data?.codeId || (res?.data && res.data.codeId);
        setVerifyModal({ show: true, parcel: { parcelIds }, action: "remove_selected", codeId });
      } else {
        const res = await driverParcelsAPI.generateRemoveAllCode(busId);
        const codeId = res?.codeId || res?.data?.codeId || (res?.data && res.data.codeId);
        setVerifyModal({ show: true, parcel: { }, action: "remove_all", codeId });
      }
    } catch (err) {
      console.error("generateRemoveAllCode failed", err);
      alert("Failed to request admin OTP for bulk remove.");
    }
  };

  const handleVerifyCode = async (code) => {
    try {
      const { parcel, action, codeId ,email} = verifyModal;
      const res = await driverParcelsAPI.verifyCode({ codeId: parcel?.codeId||codeId , code });
      if (!res?.data?.success) {
        return { ok: false, msg:res?.data?.msg || "Invalid code." };
      }
      if (action === "deliver") {
        await driverParcelsAPI.markDelivered(parcel._id,email);
        await fetchParcels(busId);
      } else if (action === "remove") {
        await driverParcelsAPI.removeParcel(parcel._id);
        await fetchParcels(busId);
      } else if (action === "remove_selected") {
        const parcelIds = parcel?.parcelIds || verifyModal.parcelIds || [];
        await driverParcelsAPI.removeSelectedParcels({ parcelIds });
        await fetchParcels(busId);
      } else if (action === "remove_all") {
        await driverParcelsAPI.removeAllParcels(busId);
        await fetchParcels(busId);
      }

      setVerifyModal({ show: false, parcel: null, action: "" });
      return { ok: true };
    } catch (err) {
      console.error("verify flow error", err);
      return { ok: false, msg: err?.message || "Verification failed" };
    }
  };

  const handleGenerateCode = async (parcelLocal, type) => {
    try {
      if (type === "deliver") {
        const res = await driverParcelsAPI.generateDeliveryCode(parcelLocal._id);//eslint-disable-line
        return true;
      } else if (type === "remove") {
        await driverParcelsAPI.generateRemoveCode(parcelLocal._id);
        return true;
      } else if (type === "remove_selected") {
        await driverParcelsAPI.generateCode({ type: "remove_selected", parcelIds: parcelLocal.parcelIds });
        return true;
      } else if (type === "remove_all") {
        await driverParcelsAPI.generateRemoveAllCode(busId);
        return true;
      }
      return false;
    } catch (err) {
      console.error("handleGenerateCode err", err);
      return false;
    }
  };

  const handleSendNotification = async (targetParcels) => {
    try {
      if (Array.isArray(targetParcels) && targetParcels.length) {
        const ids = targetParcels.map((p) => p._id);
        await driverParcelsAPI.notifySelectedParcels(busId, ids);
      } else {
        await driverParcelsAPI.notifyWholeBus(busId);
      }
      alert("Notification sent!");
    } catch (e) {
      console.error("notification err", e);
      alert("Failed to send notification.");
    }
  };

  return (
    <div className="w-full flex gap-3">
      <div className="w-2/3">
        <ParcelList
          parcels={filteredParcels}
          users={users}
          selectedParcel={selectedParcel}
          onSelect={setSelectedParcel}
          loading={loading}
          onDeliver={openDeliveryFlow}
          onRemove={openRemoveFlow}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
      </div>

      <div className="w-1/3">
        <RightPanel
          parcels={filteredParcels}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onNotify={(targets) => handleSendNotification(targets)}
          onRemoveFiltered={() => openRemoveBulkFlow()}
        />
      </div>

      <VerifyModal
        open={verifyModal.show}
        parcel={verifyModal.parcel}
        action={verifyModal.action}
        onGenerate={handleGenerateCode}
        onVerify={handleVerifyCode}
        onClose={() => setVerifyModal({ show: false, parcel: null, action: "" })}
      />

      <ConfirmModal
        open={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ show: false, title: "", message: "", onConfirm: null })}
      />
    </div>
  );
};

export default DeliveriesTable;
