import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import BusCard from "./BusCard";
import RouteCardMini from "./RouteCardMini";
import SearchBar from "./SearchBar";
import AssignForm from "./AssignForm";
import { 
  Bus, 
  Route as RouteIcon, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
} from 'lucide-react';
import { AnimatePresence,motion } from 'framer-motion'; //eslint-disable-line

const AssignRoute = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  const loadBuses = async () => {
    try {
      const res = await adminAPI.getRegionBuses();
      setBuses(res.data.buses || []);
      setFilteredBuses(res.data.buses || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load buses");
    }
  };

  const loadRoutes = async () => {
    try {
      const res = await adminAPI.getRegionRoutes();
      setRoutes(res.data.routes || []);
      setFilteredRoutes(res.data.routes || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load routes");
    }
  };

  const handleBusSearch = (term) => {
    const lower = term.toLowerCase();
    setFilteredBuses(
      buses.filter(
        (b) =>
          b.busId.toLowerCase().includes(lower) ||
          (b.driverId?.name || "").toLowerCase().includes(lower)
      )
    );
  };

  const handleRouteSearch = (term) => {
    const lower = term.toLowerCase();
    setFilteredRoutes(
      routes.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.routeId.toLowerCase().includes(lower)
      )
    );
  };
return (
    <div className="p-4 md:p-6 space-y-6 h-full flex flex-col min-h-[80vh]">
      
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl border backdrop-blur-md flex items-center gap-3 sticky top-0 z-20 shadow-lg ${
              message.toLowerCase().includes('error')
                ? "bg-red-500/10 border-red-500/20 text-red-200" 
                : "bg-green-500/10 border-green-500/20 text-green-200"
            }`}
          >
            {message.toLowerCase().includes('error') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-sm font-medium">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bus className="text-blue-400" size={20} />
              <h3 className="font-medium text-white">Region Buses</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
              {filteredBuses.length}
            </span>
          </div>
          
          <div className="mb-4">
            <SearchBar
              placeholder="Search ID or Driver..."
              handleChange={handleBusSearch} 
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredBuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
                <Bus size={32} strokeWidth={1} className="opacity-50 mb-2" />
                <p className="text-sm">No buses found.</p>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <BusCard 
                  key={bus._id} 
                  bus={bus} 
                  setMessage={setMessage} 
                  refreshData={() => { loadBuses(); loadRoutes(); }} 
                />
              ))
            )}
          </div>
        </div>
        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
             <div className="flex items-center gap-2">
              <RouteIcon className="text-green-400" size={20} />
              <h3 className="font-medium text-white">Available Routes</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
              {filteredRoutes.length}
            </span>
          </div>

          <div className="mb-4">
            <SearchBar
              placeholder="Search Route Name..."
              handleChange={handleRouteSearch} 
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredRoutes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
                <Navigation size={32} strokeWidth={1} className="opacity-50 mb-2" />
                <p className="text-sm">No routes found.</p>
              </div>
            ) : (
              filteredRoutes.map((route) => (
                <RouteCardMini key={route._id} route={route} />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-2">
        <AssignForm
          buses={buses}
          routes={routes}
          setMessage={setMessage}
          refreshData={() => { loadBuses(); loadRoutes(); }}
        />
      </div>
    </div>
  );
};

export default AssignRoute;
