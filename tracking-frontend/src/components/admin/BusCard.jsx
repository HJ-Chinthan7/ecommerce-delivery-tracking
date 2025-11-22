import { useState } from "react";
import { adminAPI } from "../../services/api";
import { 
  Bus, 
  Route as RouteIcon, 
  User, 
  CheckCircle2,  
  XCircle, 
  Unplug
} from 'lucide-react';

const BusCard = ({ bus, refreshData, setMessage }) => {
  const [loading, setLoading] = useState(false);
  const isActive = bus.isActive;

  const handleUnassign = async () => {
    if (!bus.routeId) return setMessage("No route assigned to unassign.");

    if (!window.confirm(`Remove route '${bus.routeId.name}' from bus '${bus.busId}'?`)) return;

    try {
      setLoading(true);
      const res = await adminAPI.unAssignBusRoute(bus._id);
      setMessage(res.data.message || "Route unassigned successfully");
      refreshData();
    } catch (err) {
      console.error("Unassign error:", err);
      setMessage("Failed to unassign route");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Bus size={14} className="text-zinc-500" />
            Bus {bus.busId}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
          isActive 
            ? "bg-green-500/10 text-green-400 border-green-500/20" 
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="space-y-2 pl-1">
        <div className="flex items-center gap-2 text-xs">
          <User size={12} className="text-zinc-500" />
          <span className="text-zinc-500">Driver:</span>
          {bus.driverId ? (
            <span className="text-zinc-200">{bus.driverId.name}</span>
          ) : (
            <span className="text-zinc-600 italic">Not assigned</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <RouteIcon size={12} className="text-zinc-500" />
          <span className="text-zinc-500">Route:</span>
          {bus.routeId ? (
            <span className="text-blue-400 font-medium bg-blue-400/10 px-1.5 rounded border border-blue-400/20">
              {bus.routeId.name}
            </span>
          ) : (
            <span className="text-zinc-600 italic">No route assigned</span>
          )}
        </div>
      </div>
      {bus.routeId && (
        <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={handleUnassign}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              loading
                ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30"
            }`}
          >
            <Unplug size={12} />
            {loading ? "Removing..." : "Unassign"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusCard;
