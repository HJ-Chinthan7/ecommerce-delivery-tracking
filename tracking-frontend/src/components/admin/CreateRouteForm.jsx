import { useState } from "react";
import { adminAPI } from "../../services/api";

const CreateRouteForm = ({ loadRoutes, setMessage, loading }) => {
  const [newRoute, setNewRoute] = useState({ name: "", description: "", stops: [] });

  const handleAddStop = () => {
    setNewRoute({
      ...newRoute,
      stops: [
        ...newRoute.stops,
        { stopName: "", address: "", order: newRoute.stops.length + 1 },
      ],
    });
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...newRoute.stops];
    updatedStops[index][field] = value;
    setNewRoute({ ...newRoute, stops: updatedStops });
  };

  const handleRemoveStop = (index) => {
    const updatedStops = newRoute.stops.filter((_, idx) => idx !== index);
    updatedStops.forEach((stop, idx) => (stop.order = idx + 1));
    setNewRoute({ ...newRoute, stops: updatedStops });
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.name || newRoute.stops.length === 0) {
      setMessage("Route name and stops are required");
      return;
    }
    try {
      await adminAPI.createRoute(newRoute);
      setMessage("Route created successfully");
      setNewRoute({ name: "", description: "", stops: [] });
      await loadRoutes();
    } catch (err) {
      console.error("Error creating route:", err);
      setMessage("Failed to create route");
    }
  };

  return (
    <form onSubmit={handleCreateRoute} className="space-y-4 border p-4 rounded shadow bg-white">
      <h3 className="font-semibold text-lg mb-2">Create New Route</h3>

      <input
        type="text"
        placeholder="Route Name"
        value={newRoute.name}
        onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
        className="border p-2 w-full rounded"
      />
      <textarea
        placeholder="Description"
        value={newRoute.description}
        onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <div>
        <h4 className="font-medium mb-1">Stops</h4>
        {newRoute.stops.map((stop, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2"
          >
            <input
              type="text"
              placeholder={`Stop ${idx + 1} Name`}
              value={stop.stopName}
              onChange={(e) => handleStopChange(idx, "stopName", e.target.value)}
              className="border p-1 rounded flex-1 mb-1 sm:mb-0"
            />
            <input
              type="text"
              placeholder="Address"
              value={stop.address}
              onChange={(e) => handleStopChange(idx, "address", e.target.value)}
              className="border p-1 rounded flex-1 mb-1 sm:mb-0"
            />
            <button
              type="button"
              onClick={() => handleRemoveStop(idx)}
              className="bg-red-500 text-white px-2 py-1 rounded self-start sm:self-auto"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddStop}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Stop
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
      >
        {loading ? "Creating..." : "Create Route"}
      </button>
    </form>
  );
};

export default CreateRouteForm;
