import React, { useRef, useState, useEffect } from "react";
import { 
  Loader2
} from 'lucide-react';
const RouteStops = ({ route, bus, updateStop }) => {
  const [processingStopId, setProcessingStopId] = useState(null);
  const stops = [...route.busStops].sort((a, b) => a.order - b.order);
  const stopRefs = useRef({});

  useEffect(() => {
    if (!bus.currentBusStop) return;
    const currentId = bus.currentBusStop.stopId;
    const ref = stopRefs.current[currentId];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [bus.currentBusStop]);

  const handleUpdateStop = async (stopId) => {
    setProcessingStopId(stopId);

    await updateStop(stopId);
    setProcessingStopId(null); 
  };

return (
    <div className="h-96 overflow-y-auto custom-scrollbar p-2 bg-black/20">
      {stops.map((stop) => (
        <div
          key={stop.stopId}
          ref={(el) => (stopRefs.current[stop.stopId] = el)}
          className={`flex justify-between items-center p-3 mb-2 rounded-xl border transition-all duration-300 ${
            bus.currentBusStop?.stopId === stop.stopId 
              ? "bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-mono border ${
               bus.currentBusStop?.stopId === stop.stopId
                 ? "bg-green-500 text-black border-green-400"
                 : "bg-zinc-800 text-zinc-500 border-white/10"
            }`}>
              {stop.order}
            </div>
            <div>
              <p className={`text-sm font-medium ${
                 bus.currentBusStop?.stopId === stop.stopId ? "text-white" : "text-zinc-300"
              }`}>
                {stop.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleUpdateStop(stop.stopId)}
            className={`relative h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center min-w-[80px] border ${
               processingStopId === stop.stopId
                 ? "bg-zinc-800 text-zinc-500 border-zinc-700"
                 : "bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {processingStopId === stop.stopId ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Set Current"
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RouteStops;
