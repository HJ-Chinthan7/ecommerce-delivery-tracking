import { useState } from "react";
import { adminAPI } from "../../services/api";

const CreateRouteForm = ({ loadRoutes, setMessage, loading }) => {
  const [newRoute, setNewRoute] = useState({
    name: "",
    description: "",
    maxShifts: 1,
    stops: [],
    startTimes: [],
    endTimes: [],
  });


  const handleAddStop = () => {
    setNewRoute({
      ...newRoute,
      stops: [
        ...newRoute.stops,
        { stopName: "", order: newRoute.stops.length + 1, timings: Array(newRoute.startTimes.length).fill("") },
      ],
    });
  };


  const handleStopChange = (index, value) => {
    const updatedStops = [...newRoute.stops];
    updatedStops[index].stopName = value;
    setNewRoute({ ...newRoute, stops: updatedStops });
  };

 
  const handleStopTimingChange = (stopIndex, shiftIndex, value) => {
    const updatedStops = [...newRoute.stops];
    updatedStops[stopIndex].timings[shiftIndex] = value;
    setNewRoute({ ...newRoute, stops: updatedStops });
  };

 
  const handleRemoveStop = (index) => {
    const updatedStops = newRoute.stops.filter((_, idx) => idx !== index);
    updatedStops.forEach((stop, idx) => (stop.order = idx + 1));
    setNewRoute({ ...newRoute, stops: updatedStops });
  };


  const handleAddShift = () => {
    if (newRoute.startTimes.length >= newRoute.maxShifts) {
      setMessage(`Cannot add more than ${newRoute.maxShifts} shifts`);
      return;
    }
    setNewRoute({
      ...newRoute,
      startTimes: [...newRoute.startTimes, ""],
      endTimes: [...newRoute.endTimes, ""],
      stops: newRoute.stops.map((stop) => ({
        ...stop,
        timings: [...stop.timings, ""],
      })),
    });
  };


  const handleShiftChange = (index, value, type = "start") => {
    if (type === "start") {
      const updatedStart = [...newRoute.startTimes];
      updatedStart[index] = value;
      setNewRoute({ ...newRoute, startTimes: updatedStart });
    } else {
      const updatedEnd = [...newRoute.endTimes];
      updatedEnd[index] = value;
      setNewRoute({ ...newRoute, endTimes: updatedEnd });
    }
  };


  const handleRemoveShift = (index) => {
    const updatedStart = [...newRoute.startTimes];
    const updatedEnd = [...newRoute.endTimes];
    updatedStart.splice(index, 1);
    updatedEnd.splice(index, 1);

    const updatedStops = newRoute.stops.map((stop) => {
      const newTimings = [...stop.timings];
      newTimings.splice(index, 1);
      return { ...stop, timings: newTimings };
    });

    setNewRoute({ ...newRoute, startTimes: updatedStart, endTimes: updatedEnd, stops: updatedStops });
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.name || newRoute.stops.length === 0) {
      setMessage("Route name and stops are required");
      return;
    }
    if (newRoute.startTimes.length === 0) {
      setMessage("At least one shift is required");
      return;
    }
    try {
      await adminAPI.createRoute(newRoute);
      setMessage("Route created successfully");
      setNewRoute({
        name: "",
        description: "",
        maxShifts: 1,
        stops: [],
        startTimes: [],
        endTimes: [],
      });
      await loadRoutes();
    } catch (err) {
      console.error(err);
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

      <input
        type="number"
        placeholder="Max Shifts"
        min={1}
        value={newRoute.maxShifts || ""}
        onChange={(e) => setNewRoute({ ...newRoute, maxShifts: Number(e.target.value) })}
        className="border p-2 w-full rounded"
      />

      
      <div>
        <h4 className="font-medium mb-1">Stops & Timings</h4>
        {newRoute.stops.map((stop, stopIdx) => (
          <div key={stopIdx} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
            <input
              type="text"
              placeholder={`Stop ${stopIdx + 1} Name`}
              value={stop.stopName}
              onChange={(e) => handleStopChange(stopIdx, e.target.value)}
              className="border p-1 rounded flex-1 mb-1 sm:mb-0"
            />

            {newRoute.startTimes.map((_, shiftIdx) => (
              <input
                key={shiftIdx}
                type="time"
                value={stop.timings[shiftIdx] || ""}
                onChange={(e) => handleStopTimingChange(stopIdx, shiftIdx, e.target.value)}
                className="border p-1 rounded flex-1 mb-1 sm:mb-0"
                placeholder={`Shift ${shiftIdx + 1}`}
              />
            ))}

            <button
              type="button"
              onClick={() => handleRemoveStop(stopIdx)}
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

 
      <div>
        <h4 className="font-medium mt-2 mb-1">Shifts (Start / End Times)</h4>
        {newRoute.startTimes.map((_, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <input
              type="time"
              value={newRoute.startTimes[idx]}
              onChange={(e) => handleShiftChange(idx, e.target.value, "start")}
              className="border p-1 rounded flex-1"
            />
            <input
              type="time"
              value={newRoute.endTimes[idx]}
              onChange={(e) => handleShiftChange(idx, e.target.value, "end")}
              className="border p-1 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemoveShift(idx)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddShift}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Shift
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
