import { useEffect, useState } from "react";
import { assignerAPI } from "../../services/api";
import { useAssignerAuth } from "../../AuthContext/AssignerAuthContext";
import ReassignPanel from "./ReassignPanel ";
import { LogOut, Search, MapPin, Package, CheckCircle2, Truck, RefreshCw, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen h-screen bg-black text-white font-sans selection:bg-green-500/30 flex flex-col overflow-hidden relative">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="shrink-0 h-20 border-b border-white/10 bg-black/50 backdrop-blur-xl px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Package className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-serif font-medium tracking-tight leading-none">
              Assigner<span className="text-zinc-500">Panel</span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">Welcome, {assigner?.name}</p>
          </div>
        </div>
        
        <button 
          onClick={logout} 
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all text-sm font-medium text-zinc-400"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 min-h-0 z-10 gap-6">
        
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
          {["city", "district", "state", "address"].map(f => (
            <div key={f} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" size={16} />
              <input
                type="text"
                placeholder={`Filter by ${f}...`}
                value={filters[f]}
                onChange={e => setFilters({ ...filters, [f]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex-1 flex gap-6 min-h-0">
          <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="font-medium text-zinc-200 flex items-center gap-2">
                <Package size={18} className="text-blue-400" />
                Available Orders
              </h2>
              <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
                {filterOrders(orders).length} FOUND
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filterOrders(orders).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                  <Package size={48} strokeWidth={1} />
                  <p className="mt-4 text-sm">No orders match your filters</p>
                </div>
              ) : (
                filterOrders(orders).map(order => {
                  const isSelected = selectedOrders.includes(order._id);
                  return (
                    <div
                      key={order._id}
                      onClick={() => toggleOrder(order._id)}
                      className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                        isSelected 
                          ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                          : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isSelected ? "border-blue-400 bg-blue-400 text-black" : "border-zinc-600 group-hover:border-zinc-400"}`}>
                            {isSelected && <CheckCircle2 size={12} />}
                          </div>
                          <span className="text-sm font-medium text-zinc-200">
                            {order.user?.username || "Unknown"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isSelected ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>
                          {order.orderItems?.length || 0} ITEMS
                        </span>
                      </div>
                      
                      <div className="space-y-1 ml-6">
                        <p className="text-sm text-zinc-400 line-clamp-1"><span className="text-sm font-medium text-zinc-200">Address :</span> {order.shippingAddress?.address}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 font-mono">
                         <p><span>City :</span><span>{order.shippingAddress?.city}</span></p> 
                          <span className="text-zinc-700">•</span>
                         <span>District :</span> <span>{order.shippingAddress?.district}</span>
                          <span className="text-zinc-700">•</span>
                          <span>State :</span><span>{order.shippingAddress?.state}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2 pt-2 border-t border-white/5 truncate">
                           <span className="text-zinc-600">Order Details:</span> {order.orderItems?.map(i => i.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-72 flex flex-col gap-4">
            <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                <h2 className="font-medium text-zinc-200 flex items-center gap-2">
                  <MapPin size={18} className="text-green-400" />
                  Select Region
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {regions.map(region => {
                  const isActive = selectedRegion === region._id;
                  return (
                    <button
                      key={region._id}
                      onClick={() => setSelectedRegion(region._id)}
                      className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left flex items-center justify-between group ${
                        isActive
                          ? "bg-white text-black shadow-lg shadow-white/10"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                      }`}
                    >
                      {region.name}
                      {isActive && <ArrowRight size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleAssign}
              disabled={loading || selectedOrders.length === 0 || !selectedRegion}
              className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg ${
                loading
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : selectedOrders.length > 0 && selectedRegion
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Truck size={18} />
                  <span>Assign {selectedOrders.length} Orders</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setShowReassign(true)}
          className="relative group bg-zinc-900 border border-zinc-700 text-zinc-100 px-5 py-3 rounded-full shadow-2xl hover:border-yellow-500/50 hover:text-yellow-400 transition-all flex items-center gap-3"
        >
          <RefreshCw size={18} className={reassignList.length > 0 ? "text-yellow-500" : "text-zinc-500"} />
          <span className="font-medium text-sm">Reassign Parcels</span>
          {reassignList.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
              {reassignList.length}
            </span>
          )}
        </button>
      </div>
      {showReassign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignment;
