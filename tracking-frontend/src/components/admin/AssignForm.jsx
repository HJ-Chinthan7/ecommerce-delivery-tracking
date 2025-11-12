import { useState } from "react";
import { adminAPI } from "../../services/api";

const AssignForm = ({ buses, routes, setMessage,refreshData }) => {
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");

  const handleAssign = async () => {
    if (!busId || !routeId) return setMessage("Select both bus and route");

    try {
      const res = await adminAPI.assignBusRoute({ busId, routeId });
      setMessage(res.data.message || "Route assigned successfully");
      refreshData();
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign route");
    }
  };
  return (
    <div className="mt-6 p-4 bg-white border rounded shadow flex flex-col md:flex-row items-center gap-3">
      <select
        value={busId}
        onChange={(e) => setBusId(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      >
        <option value="">Select Bus</option>
        {buses.map((b) => (
          <option key={b._id} value={b._id}>
            {b.busId}
          </option>
        ))}
      </select>

      <select
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      >
        <option value="">Select Route</option>
        {routes.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign Route
      </button>
    </div>
  );
};

export default AssignForm;
