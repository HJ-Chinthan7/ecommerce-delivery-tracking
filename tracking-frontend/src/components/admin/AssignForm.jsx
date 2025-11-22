import { useState } from "react";
import { adminAPI } from "../../services/api";
import { 
  Bus, 
  Navigation, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; //eslint-disable-line

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
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex flex-col md:flex-row items-center gap-4 shadow-2xl">
      
      <div className="relative w-full md:w-1/3 group">
        <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
        <select
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-zinc-900 text-zinc-500">Select Bus</option>
          {buses.map((b) => (
            <option key={b._id} value={b._id} className="bg-zinc-900 text-white">
              {b.busId}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">▼</div>
      </div>

      <div className="hidden md:block text-zinc-600">
        <ArrowRight size={16} />
      </div>

      <div className="relative w-full md:w-1/3 group">
        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
        <select
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-zinc-900 text-zinc-500">Select Route</option>
          {routes.map((r) => (
            <option key={r._id} value={r._id} className="bg-zinc-900 text-white">
              {r.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">▼</div>
      </div>

      <button
        onClick={handleAssign}
        className="w-full md:w-auto bg-white text-black font-medium px-6 py-3 rounded-xl text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <span>Link Route</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default AssignForm;
