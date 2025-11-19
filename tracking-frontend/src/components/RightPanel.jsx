import { useEffect, useState } from "react";

const RightPanel = ({
  parcels = [],
  onSearch = () => {},
  searchQuery = "",
  onNotify = () => {},
  onRemoveFiltered = () => {},
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => onSearch(localSearch), 200);
    return () => clearTimeout(t);
  }, [localSearch]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-md">
      <h2 className="text-xl font-bold mb-3">Search Parcels</h2>

      <input
        type="text"
        value={localSearch}
        placeholder="Search address / city / district / postal code / name / email / product…"
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <div className="space-y-3">
        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
          onClick={() => onNotify(parcels)}
        >
          Notify Filtered Parcels ({parcels?.length || 0})
        </button>

        <button
          className="w-full bg-red-600 text-white p-3 rounded-lg"
          onClick={() => onRemoveFiltered()}
        >
          Remove Filtered / All Parcels ({parcels?.length || 0})
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
