import React from "react";
import ParcelBusCard from "./ParcelBusCard";

const BusAssignerSection = ({ buses, selectedBus, onSelectBus, search, setSearch }) => {
  return (
    <div className="flex-1 max-h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-2xl space-y-2">
      <input
        type="text"
        placeholder="Search buses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-2 px-3 py-1 rounded-lg border"
      />
      {buses.map(bus => (
        <ParcelBusCard
          key={bus._id}
          bus={bus}
          selected={selectedBus === bus._id}
          onSelect={onSelectBus}
        />
      ))}
    </div>
  );
};

export default BusAssignerSection;
