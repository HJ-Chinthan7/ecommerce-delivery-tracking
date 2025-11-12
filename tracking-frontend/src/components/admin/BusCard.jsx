import { useState } from "react";
import { adminAPI } from "../../services/api";

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
    <div className="border p-3 rounded-lg shadow-sm hover:shadow-md transition bg-white">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">
          Bus ID: <span className="text-blue-700">{bus.busId}</span>
        </p>

        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="mt-2 text-sm">
        Driver:{" "}
        {bus.driverId ? (
          <span className="text-gray-800 font-medium">{bus.driverId.name}</span>
        ) : (
          <span className="text-gray-400">Not assigned</span>
        )}
      </p>

      <p className="text-sm mb-3">
        Route:{" "}
        {bus.routeId ? (
          <span className="text-blue-600 font-medium">{bus?.routeId?.name}</span>
        ) : (
          <span className="text-gray-400">No route assigned</span>
        )}
      </p>

      {bus.routeId && (
        <button
          onClick={handleUnassign}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {loading ? "Removing..." : "Unassign Route"}
        </button>
      )}
    </div>
  );
};

export default BusCard;
