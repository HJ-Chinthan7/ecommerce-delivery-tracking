import RouteCard from "./RouteCard";
import {  Map } from "lucide-react";
const RouteList = ({ routes, loadRoutes, setMessage }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 min-h-[200px]">
        <Map size={48} strokeWidth={1} className="opacity-50 mb-4" />
        <p className="text-sm">No active routes found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
      {routes.map((route) => (
        <RouteCard
          key={route._id}
          route={route}
          loadRoutes={loadRoutes}
          setMessage={setMessage}
        />
      ))}
    </div>
  );
};

export default RouteList;
