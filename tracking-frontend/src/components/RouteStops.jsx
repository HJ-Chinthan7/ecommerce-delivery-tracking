import React, { useRef, useState, useEffect } from "react";

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
    <div className="h-96 overflow-y-auto border rounded p-2 bg-gray-50">
      {stops.map((stop) => (
        <div
          key={stop.stopId}
          ref={(el) => (stopRefs.current[stop.stopId] = el)}
          className={`flex justify-between items-center p-3 mb-2 rounded transition-all ${
            bus.currentBusStop?.stopId === stop.stopId ? "bg-green-100" : "bg-white"
          }`}
        >
          <div>
            <p className="text-sm font-medium">{stop.name}</p>
            <p className="text-xs text-gray-500">Order: {stop.order}</p>
          </div>
          <button
            onClick={() => handleUpdateStop(stop.stopId)}
            className="relative text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center justify-center min-w-[60px]"
          >
            {processingStopId === stop.stopId ? (
              <span className="w-4 h-4 border-2 border-t-blue-600 border-gray-200 rounded-full animate-spin"></span>
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
