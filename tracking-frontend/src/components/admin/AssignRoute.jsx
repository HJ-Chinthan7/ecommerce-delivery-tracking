import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import BusCard from "./BusCard";
import RouteCardMini from "./RouteCardMini";
import SearchBar from "./SearchBar";
import AssignForm from "./AssignForm";

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
    <div className="p-6 space-y-6 min-h-screen overflow-y-auto bg-gray-50">
    
      {message && (
        <div className="bg-green-100 text-green-800 p-2 rounded shadow-sm sticky top-0 z-10">
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
     
        <div className="flex-1 border rounded p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-lg mb-2 text-blue-700">Buses</h3>
          <SearchBar
            placeholder="Search bus by ID or driver name"
            onSearch={handleBusSearch}
          />
          <div className="mt-3 space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {filteredBuses.map((bus) => (
              <BusCard key={bus._id} bus={bus} setMessage={setMessage} refreshData={() => {
          loadBuses();
          loadRoutes();
        }}  />
            ))}
            {filteredBuses.length === 0 && (
              <p className="text-gray-400 text-center">No buses found.</p>
            )}
          </div>
        </div>

        <div className="flex-1 border rounded p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Routes</h3>
          <SearchBar
            placeholder="Search route by name or ID"
            onSearch={handleRouteSearch}
          />
          <div className="mt-3 space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {filteredRoutes.map((route) => (
              <RouteCardMini key={route._id} route={route} />
            ))}
            {filteredRoutes.length === 0 && (
              <p className="text-gray-400 text-center">No routes found.</p>
            )}
          </div>
        </div>
      </div>
      <AssignForm
        buses={buses}
        routes={routes}
        setMessage={setMessage}
        refreshData={() => {
          loadBuses();
          loadRoutes();
        }}
      />
    </div>
  );
};

export default AssignRoute;
