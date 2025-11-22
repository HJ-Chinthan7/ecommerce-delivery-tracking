import { useState } from "react";
import { adminAPI } from "../../services/api";
import { Plus, Trash2, Clock, StopCircle } from "lucide-react";
const CreateRouteForm = ({ loadRoutes, setMessage, loading }) => {
  const inputClass =
    "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all";
  const labelClass =
    "block text-xs font-mono text-zinc-500 mb-1 uppercase tracking-wider";

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
        {
          stopName: "",
          order: newRoute.stops.length + 1,
          timings: Array(newRoute.startTimes.length).fill(""),
        },
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

    setNewRoute({
      ...newRoute,
      startTimes: updatedStart,
      endTimes: updatedEnd,
      stops: updatedStops,
    });
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
    <form onSubmit={handleCreateRoute} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Route Name</label>
          <input
            type="text"
            placeholder="e.g. Downtown Express"
            value={newRoute.name}
            onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            placeholder="Route details..."
            value={newRoute.description}
            onChange={(e) =>
              setNewRoute({ ...newRoute, description: e.target.value })
            }
            className={`${inputClass} min-h-[80px] resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Max Shifts</label>
          <input
            type="number"
            min={1}
            value={newRoute.maxShifts || ""}
            onChange={(e) =>
              setNewRoute({ ...newRoute, maxShifts: Number(e.target.value) })
            }
            className={inputClass}
          />
        </div>
      </div>
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Clock size={14} /> Shift Timings
          </h4>
          <button
            type="button"
            onClick={handleAddShift}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={12} /> Add Shift
          </button>
        </div>

        <div className="space-y-2">
          {newRoute.startTimes.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <input
                  type="time"
                  value={newRoute.startTimes[idx]}
                  onChange={(e) =>
                    handleShiftChange(idx, e.target.value, "start")
                  }
                  className={`${inputClass} text-center`}
                />
                <input
                  type="time"
                  value={newRoute.endTimes[idx]}
                  onChange={(e) =>
                    handleShiftChange(idx, e.target.value, "end")
                  }
                  className={`${inputClass} text-center`}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveShift(idx)}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <StopCircle size={14} /> Bus Stops
          </h4>
          <button
            type="button"
            onClick={handleAddStop}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={12} /> Add Stop
          </button>
        </div>

        <div className="space-y-3">
          {newRoute.stops.map((stop, stopIdx) => (
            <div
              key={stopIdx}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-zinc-500 font-mono">
                  #{stopIdx + 1}
                </span>
                <input
                  type="text"
                  placeholder="Stop Name"
                  value={stop.stopName}
                  onChange={(e) => handleStopChange(stopIdx, e.target.value)}
                  className={`${inputClass} bg-black/20`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStop(stopIdx)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {newRoute.startTimes.map((_, shiftIdx) => (
                  <input
                    key={shiftIdx}
                    type="time"
                    value={stop.timings[shiftIdx] || ""}
                    onChange={(e) =>
                      handleStopTimingChange(stopIdx, shiftIdx, e.target.value)
                    }
                    className={`${inputClass} text-xs py-1 text-center bg-black/20`}
                    placeholder={`S${shiftIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {loading ? "Creating..." : "Create Route"}
      </button>
    </form>
  );
};

export default CreateRouteForm;
