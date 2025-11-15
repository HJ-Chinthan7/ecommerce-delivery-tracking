import React from "react";

const ParcelBusCard = ({ bus, selected, onSelect }) => {
  return (
    <div
      className={`p-3 rounded-lg bg-white cursor-pointer shadow-sm hover:shadow-md ${
        selected ? "border-2 border-blue-500" : ""
      }`}
      onClick={() => onSelect(bus._id)}
    >
      <div className="text-gray-900 font-semibold text-lg">
        {bus?.routeId?.name || "N/A"}
      </div>
      <div className="text-gray-500 text-sm mb-1">
        {bus?.routeId?.description || "No description"}
      </div>
      <div className="text-gray-600 text-sm">
        Driver: {bus.driverId?.name || "N/A"}
      </div>
    </div>
  );
};

export default ParcelBusCard;
