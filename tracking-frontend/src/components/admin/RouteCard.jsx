import { useState } from "react";
import { adminAPI } from "../../services/api";
import {  
  Clock, 
  ChevronDown, 
  ChevronUp, 
  StopCircle
} from "lucide-react";
import { AnimatePresence,motion } from 'framer-motion'; //eslint-disable-line
const RouteCard = ({ route, loadRoutes, setMessage }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDeleteRoute = async () => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await adminAPI.deleteRoute(route._id);
      setMessage("Route deleted successfully");
      await loadRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
      setMessage("Failed to delete route");
    }
  };

  const handleToggleRouteStatus = async () => {
    try {
      await adminAPI.toggleRouteStatus(route._id);
      await loadRoutes();
    } catch (err) {
      console.error("Error toggling route status:", err);
    }
  };

  return (
    <div className="group border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-white text-sm">{route.name}</h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wide ${
                route.isActive 
                  ? "bg-green-500/10 text-green-400 border-green-500/20" 
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {route.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-1">{route.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
                className="text-zinc-500 hover:text-white transition-colors p-1"
             >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400 font-mono">
           <div className="flex items-center gap-1">
              <Clock size={12} />
              {route.startTimes.length} Shifts
           </div>
           <div className="flex items-center gap-1">
              <StopCircle size={12} />
              {route.busStops?.length || 0} Stops
           </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-4 space-y-4">
              
              <div className="flex gap-2 justify-end mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRouteStatus();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                     route.isActive
                     ? "border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                     : "border-green-500/20 text-green-500 hover:bg-green-500/10"
                  }`}
                >
                  {route.isActive ? "Deactivate Route" : "Activate Route"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoute();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Stop Schedule</h5>
                <div className="bg-white/[0.02] rounded-lg border border-white/5 overflow-hidden">
                  {route.busStops.map((stop, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-600 w-4">{idx + 1}</span>
                        <span className="text-sm text-zinc-300">{stop.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {stop.timings.map((time, tIdx) => (
                          <span key={tIdx} className="text-xs font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                            {time || '--:--'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RouteCard;
