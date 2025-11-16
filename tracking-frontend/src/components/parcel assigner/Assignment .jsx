import { useEffect, useState } from "react";
import { assignerAPI } from "../../services/api";
import { useAssignerAuth } from "../../AuthContext/AssignerAuthContext";
import ReassignPanel from "./ReassignPanel ";

const Assignment = () => {
  const { token, assigner, logout } = useAssignerAuth(); //eslint-disable-line

  const [orders, setOrders] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [reassignList, setReassignList] = useState([]);
  const [showReassign, setShowReassign] = useState(false);
  const [selectedReassign, setSelectedReassign] = useState([]);

  const [filters, setFilters] = useState({ city: "", district: "", state: "", address: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchRegions();
    fetchReassignList();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await assignerAPI.getParcels();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  const fetchRegions = async () => {
    try {
      const { data } = await assignerAPI.getRegions();
      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRegions([]);
    }
  };

  const fetchReassignList = async () => {
    try {
      const response = await assignerAPI.getReassignParcels();
      const list = response?.data?.list || [];
      setReassignList(list);
    } catch (err) {
      console.error(err);
      setReassignList([]);
    }
  };

  const toggleOrder = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  const filterOrders = (orderList) => {
    if (!Array.isArray(orderList)) return [];
    return orderList.filter(o => {
      const addr = o.shippingAddress || {};
      return (
        (addr.city || "").toLowerCase().includes(filters.city.toLowerCase()) &&
        (addr.district || "").toLowerCase().includes(filters.district.toLowerCase()) &&
        (addr.state || "").toLowerCase().includes(filters.state.toLowerCase()) &&
        (addr.address || "").toLowerCase().includes(filters.address.toLowerCase())
      );
    });
  };

  const handleAssign = async () => {
    if (!selectedRegion || selectedOrders.length === 0) return alert("Select orders and region");
    setLoading(true);
    try {
      await assignerAPI.assignParcel({ orderIds: selectedOrders, regionId: selectedRegion });
      setOrders(prev => prev.filter(o => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      fetchReassignList();
    } catch (err) {
      console.error(err);
      alert("Failed to assign parcels");
    }
    setLoading(false);
  };

  const handleReassign = async () => {
    if (!selectedRegion || selectedReassign.length === 0) return alert("Select parcels and region");
    setLoading(true);
    try {
      await assignerAPI.reassignParcel({ parcelIds: selectedReassign, regionId: selectedRegion });
      setReassignList(prev => prev.filter(p => !selectedReassign.includes(p._id)));
      setSelectedReassign([]);
      setShowReassign(false);
    } catch (err) {
      console.error(err);
      alert("Failed to reassign parcels");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-col h-screen bg-gray-100">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Welcome, {assigner?.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="flex gap-2 mb-4">
        {["city", "district", "state", "address"].map(f => (
          <input
            key={f}
            type="text"
            placeholder={`Search by ${f}`}
            value={filters[f]}
            onChange={e => setFilters({ ...filters, [f]: e.target.value })}
            className="p-2 border rounded flex-1"
          />
        ))}
      </div>

      <div className="flex gap-4 h-[90%] overflow-hidden">

        <div className="flex-1 bg-white rounded shadow p-4 overflow-y-auto">
          <h2 className="font-bold mb-2">Assign Orders</h2>
          {filterOrders(orders).map(order => (
            <div
              key={order._id}
              onClick={() => toggleOrder(order._id)}
              className={`border p-3 mb-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all ${
                selectedOrders.includes(order._id) ? "bg-blue-100" : ""
              }`}
            >
              <p className="font-semibold">UserName:{order.user?.username || "Unknown"}</p>
              <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
              <p><strong>District:</strong> {order.shippingAddress?.district}</p>
              <p><strong>City:</strong> {order.shippingAddress?.city}</p>
              <p><strong>State:</strong> {order.shippingAddress?.state}</p>
              <p><strong>Items:</strong> {order.orderItems?.map(i => i.name).join(", ")}</p>
            </div>
          ))}
        </div>

        <div className="w-64 flex flex-col gap-3">
          <h2 className="font-bold mb-2 text-center">Regions</h2>
          {regions.map(region => (
            <div
              key={region._id}
              onClick={() => setSelectedRegion(region._id)}
              className={`border-2 border-gray-300 rounded-2xl p-4 text-center cursor-pointer shadow-md hover:shadow-lg transition-all ${
                selectedRegion === region._id ? "bg-green-200 border-green-400" : "bg-white"
              }`}
            >
              {region.name}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleAssign}
        className={`mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Assigning..." : "Assign Selected Orders"}
      </button>

      <button
        onClick={() => setShowReassign(true)}
        className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded shadow-lg hover:bg-yellow-600 transition"
      >
        Reassign Parcels ({reassignList.length})
      </button>

      {showReassign && (
        <ReassignPanel
          parcels={reassignList}
          regions={regions}
          selectedParcels={selectedReassign}
          setSelectedParcels={setSelectedReassign}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          onClose={() => setShowReassign(false)}
          onReassign={handleReassign}
          loading={loading}
          onRefresh={fetchReassignList} 
        />
      )}
    </div>
  );
};

export default Assignment;
