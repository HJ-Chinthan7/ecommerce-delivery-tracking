import React, { useState, useEffect } from "react";
import ParcelCard from './ParcelCard'
import BusAssignerSection from './BusAssignerSection'
import TabsContainer from './TabsContainer'
import { adminAPI } from "../../services/api";
import { useLocation } from "react-router-dom";

const ParcelAssignerPageWithTabs = () => {
  
  const location = useLocation();
  const regionId = location.state?.regionId;
  const [unassignedParcels, setUnassignedParcels] = useState([]);
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [addressChangedParcels, setAddressChangedParcels] = useState([]);
  const [buses, setBuses] = useState([]);

  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedUnassignParcels, setSelectedUnassignParcels] = useState([]);
  const [selectedRegionParcels, setSelectedRegionParcels] = useState([]);

  const [parcelSearch, setParcelSearch] = useState("");
  const [busSearch, setBusSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [unassignedRes, assignedRes, addressChangedRes, busesRes] =
        await Promise.all([
          adminAPI.getUnassignedParcels(regionId),
          adminAPI.getAssignedParcels(regionId),
          adminAPI.getAddressChangedParcels(regionId),
          adminAPI.getRegionBuses(regionId),
        ]);

      setUnassignedParcels(
        Array.isArray(unassignedRes?.data) ? unassignedRes.data : []
      );
      setAssignedParcels(
        Array.isArray(assignedRes?.data) ? assignedRes.data : []
      );
      setAddressChangedParcels(
        Array.isArray(addressChangedRes?.data) ? addressChangedRes.data : []
      );
      setBuses(Array.isArray(busesRes?.data?.buses) ? busesRes.data?.buses : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleSelect = (id, type) => {
    switch (type) {
      case "assign":
        setSelectedParcels((prev) =>
          prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
        break;
      case "unassign":
        setSelectedUnassignParcels((prev) =>
          prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
        break;
      case "region":
        setSelectedRegionParcels((prev) =>
          prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
        break;
      default:
        break;
    }
  };

  const assignBus = async () => {
    if (!selectedBus || selectedParcels.length === 0) return;
    await adminAPI.assignBusToParcels({ parcelIds: selectedParcels, busId: selectedBus });
    setSelectedParcels([]);
    setSelectedBus(null);
    fetchData();
  };

  const unassignBus = async () => {
    if (selectedUnassignParcels.length === 0) return;
    await adminAPI.unassignParcelsFromBus({ parcelIds: selectedUnassignParcels });
    setSelectedUnassignParcels([]);
    fetchData();
  };

  const removeRegion = async () => {
    if (selectedRegionParcels.length === 0) return;
    await adminAPI.removeParcelsRegion({ parcelIds: selectedRegionParcels });
    setSelectedRegionParcels([]);
    fetchData();
  };

  const filteredParcels = (unassignedParcels || []).filter((p) => {
    const address = p.shippingAddress?.address?.toLowerCase() || "";
    const city = p.shippingAddress?.city?.toLowerCase() || "";
    const district = p.shippingAddress?.district?.toLowerCase() || "";
    const search = parcelSearch.toLowerCase();
    return address.includes(search) || city.includes(search) || district.includes(search);
  });

  const filteredBuses = (buses || []).filter((b) => {
    const name = b.name?.toLowerCase() || "";
    const desc = b.description?.toLowerCase() || "";
    const search = busSearch.toLowerCase();
    return name.includes(search) || desc.includes(search);
  });

  return (
    <TabsContainer
      tabs={[
        { id: "assign", name: "Assign Parcels" },
        { id: "unassign", name: "Unassign Parcels" },
        { id: "region", name: "Remove Region" },
      ]}
    >
      {(activeTab) => {
        switch (activeTab) {
          case "assign":
            return (
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <div className="flex-1 max-h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-2xl space-y-2">
                    <input
                      type="text"
                      placeholder="Search parcels..."
                      value={parcelSearch}
                      onChange={(e) => setParcelSearch(e.target.value)}
                      className="w-full mb-2 px-3 py-1 rounded-lg border"
                    />
                    {filteredParcels.map((p) => (
                      <ParcelCard
                        key={p._id}
                        parcel={p}
                        selected={selectedParcels.includes(p._id)}
                        onSelect={toggleSelect}
                        type="assign"
                      />
                    ))}
                  </div>
                  <BusAssignerSection
                    buses={filteredBuses}
                    selectedBus={selectedBus}
                    onSelectBus={setSelectedBus}
                    search={busSearch}
                    setSearch={setBusSearch}
                  />
                </div>
                <button
                  onClick={assignBus}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Assign Selected Parcels
                </button>
              </div>
            );

          case "unassign":
            return (
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <div className="flex-1 max-h-[300px] overflow-y-auto bg-gray-100 p-4 rounded-2xl space-y-2">
                    {(assignedParcels || []).map((p) => (
                      <ParcelCard
                        key={p._id}
                        parcel={p}
                        selected={selectedUnassignParcels.includes(p._id)}
                        onSelect={toggleSelect}
                        type="unassign"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={unassignBus}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Unassign Selected Parcels
                </button>
              </div>
            );

          case "region":
            return (
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <div className="flex-1 max-h-[300px] overflow-y-auto bg-gray-100 p-4 rounded-2xl space-y-2">
                    {(addressChangedParcels || []).map((p) => (
                      <ParcelCard
                        key={p._id}
                        parcel={p}
                        selected={selectedRegionParcels.includes(p._id)}
                        onSelect={toggleSelect}
                        type="region"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={removeRegion}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Remove Region from Selected Parcels
                </button>
              </div>
            );
          default:
            return null;
        }
      }}
    </TabsContainer>
  );
};

export default ParcelAssignerPageWithTabs;
