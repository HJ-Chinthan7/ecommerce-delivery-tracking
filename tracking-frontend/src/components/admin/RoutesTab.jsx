import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import CreateRouteForm from "./CreateRouteForm";
import RouteList from "./RouteList";

const RoutesTab = ({ loading }) => {
  const [routes, setRoutes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await adminAPI.getRegionRoutes();
      setRoutes(res.data.routes || []);
    } catch (err) {
      console.error("Error loading routes:", err);
      setMessage("Failed to load routes");
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-100 text-green-800 p-2 rounded">{message}</div>
      )}
      
      <CreateRouteForm loadRoutes={loadRoutes} setMessage={setMessage} loading={loading} />
      <RouteList routes={routes} loadRoutes={loadRoutes} setMessage={setMessage} />
    </div>
  );
};

export default RoutesTab;
