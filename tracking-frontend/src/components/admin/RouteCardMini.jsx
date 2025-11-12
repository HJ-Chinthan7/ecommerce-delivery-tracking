const RouteCardMini = ({ route }) => {
  return (
    <div className="border p-3 rounded shadow-sm hover:shadow-md transition">
      <p className="font-semibold text-blue-600">{route.name}</p>
      <p className="text-sm text-gray-500">{route.description}</p>
      {route.startTimes?.length > 0 && (
        <p className="text-xs mt-1">
          <span className="font-medium">Shifts:</span>{" "}
          {route.startTimes.map((t, i) => `${t} - ${route.endTimes[i] || "?"}`).join(", ")}
        </p>
      )}
    </div>
  );
};

export default RouteCardMini;
