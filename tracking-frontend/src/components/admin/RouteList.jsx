import RouteCard from "./RouteCard";

const RouteList = ({ routes, loadRoutes, setMessage }) => {
  if (!routes || routes.length === 0)
    return <p className="text-gray-500">No routes available</p>;

  return (
    <div className="max-h-96 overflow-y-auto border p-4 rounded shadow bg-white space-y-4">
      <h3 className="font-semibold text-lg mb-2">All Routes</h3>
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
