import React, { useState, useEffect } from "react";
import ParcelCard from './ParcelCard'
import BusAssignerSection from './BusAssignerSection'
import TabsContainer from './TabsContainer'
import { adminAPI } from "../../services/api";
import { useLocation } from "react-router-dom";
import { 
  Search, 
  Box, 
  AlertTriangle, 
  ArrowLeft, 
  Unplug
} from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
const ParcelAssignerPageWithTabs = () => {
  const navigate=useNavigate();
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 p-6">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/login/admin-dashboard')} 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-serif font-medium tracking-tight"> Parcel Assigner To Bus</h1>
            <p className="text-xs text-zinc-500 font-mono">Manage logistics & distribution</p>
          </div>
        </div>
      </div>

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
                <div className="flex flex-col gap-6 h-[700px]">
                  <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                    
                    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col shadow-lg shadow-black/20">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-medium text-white flex items-center gap-2">
                          <Box size={18} className="text-blue-400" />
                          Available Parcels
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">{filteredParcels.length} items</span>
                      </div>
                      
                      <div className="relative group mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                          type="text"
                          placeholder="Search Parcel ID..."
                          value={parcelSearch}
                          onChange={(e) => setParcelSearch(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredParcels.length === 0 ? (
                           <p className="text-zinc-600 text-center text-sm mt-10">No parcels found.</p>
                        ) : (
                          filteredParcels.map((p) => (
                            <ParcelCard
                              key={p._id}
                              parcel={p}
                              selected={selectedParcels.includes(p._id)}
                              onSelect={toggleSelect}
                              type="assign"
                            />
                          ))
                        )}
                      </div>
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
                    disabled={selectedParcels.length === 0 || !selectedBus}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      selectedParcels.length > 0 && selectedBus
                        ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    Assign {selectedParcels.length} Parcels
                  </button>
                </div>
              );

            case "unassign":
              return (
                <div className="flex flex-col gap-6 h-[710px]">
                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col">
                     <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-medium text-white flex items-center gap-2">
                          <Unplug size={18} className="text-red-400" />
                          Assigned Parcels
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">{(assignedParcels || []).length} active</span>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {(assignedParcels || []).length === 0 ? (
                          <p className="text-zinc-600 text-center text-sm mt-10">No assigned parcels found.</p>
                      ) : (
                        (assignedParcels || []).map((p) => (
                          <ParcelCard
                            key={p._id}
                            parcel={p}
                            selected={selectedUnassignParcels.includes(p._id)}
                            onSelect={toggleSelect}
                            type="unassign"
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    onClick={unassignBus}
                    disabled={selectedUnassignParcels.length === 0}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      selectedUnassignParcels.length > 0
                        ? "bg-red-600 text-white hover:bg-red-500 hover:shadow-red-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    Unassign {selectedUnassignParcels.length} Parcels
                  </button>
                </div>
              );

            case "region":
              return (
                <div className="flex flex-col gap-6 h-[600px]">
                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col">
                     <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-medium text-white flex items-center gap-2">
                          <AlertTriangle size={18} className="text-yellow-500" />
                          Parcels with Address Changes
                        </h3>
                     </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {(addressChangedParcels || []).length === 0 ? (
                          <p className="text-zinc-600 text-center text-sm mt-10">No parcels require region removal.</p>
                      ) : (
                          (addressChangedParcels || []).map((p) => (
                          <ParcelCard
                              key={p._id}
                              parcel={p}
                              selected={selectedRegionParcels.includes(p._id)}
                              onSelect={toggleSelect}
                              type="region"
                          />
                          ))
                      )}
                    </div>
                  </div>
                  <button
                    onClick={removeRegion}
                    disabled={selectedRegionParcels.length === 0}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                       selectedRegionParcels.length > 0
                        ? "bg-orange-600 text-white hover:bg-orange-500 hover:shadow-orange-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    Remove Region ({selectedRegionParcels.length})
                  </button>
                </div>
              );
            default:
              return null;
          }
        }}
      </TabsContainer>
    </div>
  );
};

export default ParcelAssignerPageWithTabs;
