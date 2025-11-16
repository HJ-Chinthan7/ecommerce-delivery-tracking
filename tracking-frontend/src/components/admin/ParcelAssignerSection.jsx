import React from "react";

const ParcelAssignerSection = ({ title, items, selectedItems, onSelect, search, setSearch, type }) => {
  return (
    <div className="mb-8 ">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex gap-6 ">
        <div className="flex-1 max-h-[300px] overflow-y-auto bg-gray-100 p-4 rounded-2xl space-y-2">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-2 px-3 py-1 rounded-lg border"
          />
          {items.map(item => (
            <ParcelCard
              key={item._id}
              parcel={item}
              selected={selectedItems.includes(item._id)}
              onSelect={onSelect}
              type={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParcelAssignerSection;
