import { adminAPI } from "../../services/api";

const RouteCard = ({ route, loadRoutes, setMessage }) => {
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
      <div className="flex justify-between items-center">
        <div>
          <strong>{route.name}</strong>{" "}
          <span
            className={`px-2 py-1 text-sm rounded ${
              route.isActive ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {route.isActive ? "Active" : "Inactive"}
          </span>
          <p className="text-gray-600 text-sm">{route.description}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleToggleRouteStatus}
            className="bg-yellow-400 text-white px-2 py-1 rounded"
          >
            {route.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={handleDeleteRoute}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>

    
      <div className="mt-2 pl-4 space-y-1">
        {route.busStops.map((stop, idx) => (
          <div key={idx} className="flex justify-between text-sm border-b pb-1">
            <span>
              {stop.order}. {stop.name}
            </span>
            <span className="text-gray-500">{stop.address}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteCard;
