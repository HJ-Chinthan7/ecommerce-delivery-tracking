import { useState } from "react";
import { adminAPI } from "../../services/api";

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
    <div className="border-b pb-2 mb-2">
  
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <strong>{route.name}</strong>{" "}
          <span className={`px-2 py-1 text-sm rounded ${route.isActive ? "bg-green-200" : "bg-red-200"}`}>
            {route.isActive ? "Active" : "Inactive"}
          </span>
          <p className="text-gray-600 text-sm">{route.description}</p>

          <div className="mt-1 text-sm text-gray-700">
            Shifts:{" "}
            {route.startTimes.map((start, idx) => (
              <span key={idx}>
                {start} - {route.endTimes[idx]}{idx < route.startTimes.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleRouteStatus();
            }}
            className="bg-yellow-400 text-white px-2 py-1 rounded"
          >
            {route.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRoute();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 pl-4 space-y-2">
          {route.busStops.map((stop, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between border-b pb-1">
              <span>{stop.order}. {stop.name}</span>
              <div className="flex space-x-2 text-sm text-gray-500">
                {stop.timings.map((time, tIdx) => (
                  <span key={tIdx}>{time}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteCard;
