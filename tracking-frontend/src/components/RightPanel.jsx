import { useEffect, useState } from "react";
import { 
  Search, 
  Bell, 
  Trash2
} from 'lucide-react';
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
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
         <Search className="text-blue-400" size={20} />
         <h2 className="text-lg font-medium text-white">Filters & Actions</h2>
      </div>

      <div className="mb-6">
        <label className="text-xs font-mono text-zinc-500 mb-2 block uppercase tracking-wider">Quick Search</label>
        <input
          type="text"
          value={localSearch}
          placeholder="Filter results..."
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="space-y-3">
        <button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          onClick={() => onNotify(parcels)}
        >
          <Bell size={16} />
          Notify Filtered ({parcels?.length || 0})
        </button>

        <button
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          onClick={() => onRemoveFiltered()}
        >
          <Trash2 size={16} />
          Remove Filtered ({parcels?.length || 0})
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 text-center">
         <p className="text-[10px] text-zinc-600 font-mono">
            Use search to find parcel .
         </p>
      </div>
    </div>
  );
};

export default RightPanel;
