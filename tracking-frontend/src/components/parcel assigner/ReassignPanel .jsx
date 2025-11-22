import React from "react";
import { X, RefreshCw, MapPin, Package, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
const ReassignPanel = ({
  parcels,
  regions,
  selectedParcels,
  setSelectedParcels,
  selectedRegion,
  setSelectedRegion,
  onClose,
  onReassign,
  loading,
  onRefresh 
}) => {

  const toggleParcel = (id) => {
    setSelectedParcels(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] w-full max-w-[1200px] h-[85vh] rounded-3xl border border-white/10 shadow-2xl shadow-black/50 flex overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 bg-black/20">
          <div className="shrink-0 p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <AlertCircle className="text-yellow-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Reassign Parcels</h2>
                <p className="text-xs text-zinc-500 font-mono">Select parcels to move to a new region</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh List"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {parcels.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                 <Package size={40} strokeWidth={1} />
                 <p className="mt-2 text-sm">No parcels found for reassignment</p>
               </div>
            ) : (
              parcels.map((p, index) => {
                const parcelData = p.parcel || p;
                const userData = p.order?.user || parcelData.user || {};
                const isSelected = selectedParcels.includes(parcelData._id);

                return (
                  <div
                    key={parcelData._id || index}
                    onClick={() => toggleParcel(parcelData._id)}
                    className={`relative group p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected 
                            ? "bg-yellow-500 border-yellow-500 text-black" 
                            : "border-zinc-600 group-hover:border-zinc-400"
                        }`}>
                          {isSelected && <CheckCircle2 size={14} />}
                        </div>
                        <span className="font-medium text-zinc-200 text-sm">
                          {userData.username || "Unknown Customer"}
                        </span>
                      </div>
                      {parcelData.items?.length > 0 && (
                        <span className="text-[10px] font-mono bg-white/5 border border-white/5 px-2 py-1 rounded text-zinc-400">
                          {parcelData.items.length} ITEMS
                        </span>
                      )}
                    </div>
                    <div className="pl-8 space-y-1">
                      <div className="flex items-start gap-2 text-xs text-zinc-400">
                         <MapPin size={12} className="mt-0.5 text-zinc-600 shrink-0" />
                         <div>

                         <span className="text-sm font-medium text-zinc-200">Address :  </span><span className="line-clamp-0 ml-1">{parcelData.shippingAddress?.address}</span>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-5 text-[11px] font-mono text-zinc-500 uppercase tracking-wide">
                       <span>city:</span> <span>{parcelData.shippingAddress?.city}</span>
                        <span className="text-zinc-700">•</span>
                        <span>District: </span><span>{parcelData.shippingAddress?.district}</span>
                        <span className="text-zinc-700">•</span>
                       
                        <span>State: </span> <span>{parcelData.shippingAddress?.state}</span>
                      </div>
                      <div className="pl-5 pt-2 mt-2 border-t border-white/5 text-xs text-zinc-500 truncate">
                       Order Item: <span className="text-zinc-300">{parcelData.items?.map(i => i.name).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="w-80 bg-zinc-900/50 backdrop-blur-xl flex flex-col border-l border-white/10">
          <div className="p-4 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6 flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <MapPin size={14} /> Target Region
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {regions.map(region => {
                  const isActive = selectedRegion === region._id;
                  return (
                    <button
                      key={region._id}
                      onClick={() => setSelectedRegion(region._id)}
                      className={`w-full p-4 rounded-xl border text-sm font-medium transition-all text-left group relative overflow-hidden ${
                        isActive
                          ? "bg-green-500/10 border-green-500/50 text-green-400"
                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:border-white/10"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-between">
                        {region.name}
                        {isActive && <ArrowRight size={14} />}
                      </span>
                      {isActive && <div className="absolute inset-0 bg-green-500/5 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="mb-4 flex justify-between text-xs text-zinc-500 font-mono">
                <span>SELECTED</span>
                <span className={selectedParcels.length > 0 ? "text-white" : ""}>{selectedParcels.length} PARCELS</span>
              </div>
              
              <button
                onClick={onReassign}
                disabled={loading || selectedParcels.length === 0 || !selectedRegion}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : selectedParcels.length > 0 && selectedRegion
                      ? "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reassign</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReassignPanel;
