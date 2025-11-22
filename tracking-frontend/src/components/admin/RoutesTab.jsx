import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import CreateRouteForm from "./CreateRouteForm";
import RouteList from "./RouteList";
import { Map, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line

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
  const isError =
    message &&
    (message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("fail"));

  return (
    <div className="py-4 space-y-6">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border backdrop-blur-sm flex items-center gap-3 ${
              isError
                ? "bg-red-500/10 border-red-500/20 text-red-200"
                : "bg-green-500/10 border-green-500/20 text-green-200"
            }`}
          >
            {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-sm font-medium">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-1">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Map className="text-blue-400" size={20} />
              <h3 className="text-lg font-medium text-white">Create Route</h3>
            </div>
            <CreateRouteForm
              loadRoutes={loadRoutes}
              setMessage={setMessage}
              loading={loading}
            />
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
              <h3 className="text-lg font-medium text-white">Active Routes</h3>
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                {routes?.length || 0} ROUTES
              </span>
            </div>

            <RouteList
              routes={routes}
              loadRoutes={loadRoutes}
              setMessage={setMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesTab;
