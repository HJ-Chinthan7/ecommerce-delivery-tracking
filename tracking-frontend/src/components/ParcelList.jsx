import ParcelCard from "./ParcelCard";
import { 
  Search, 
  Box,  
  Package, 
} from 'lucide-react';
const ParcelList = ({
  parcels = [],
  users = {},
  onDeliver,
  onRemove,
  selectedParcel,
  onSelect,
  loading = false,
  searchQuery = "",
  onSearch = () => {},
}) => {
 return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-md shadow-2xl h-[80vh] flex flex-col">
      
      <div className="relative group mb-6 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by Name, Address, ID..."
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500 animate-pulse">
             <Box size={32} />
             <p className="text-sm mt-2">Loading parcels...</p>
          </div>
        )}

        {!loading && parcels.length === 0 && (
           <div className="flex flex-col items-center justify-center h-40 text-zinc-600">
              <Package size={32} strokeWidth={1} className="mb-2 opacity-50" />
              <p className="text-sm">No parcels found.</p>
           </div>
        )}

        {parcels.map((parcel) => {
          const userInfo = users?.[parcel.user] || null;
          return (
            <div
              key={parcel._id}
              onClick={() => onSelect && onSelect(parcel._id)}
              className={`cursor-pointer transition-all duration-200 rounded-2xl border ${
                 selectedParcel === parcel._id 
                   ? "bg-white/[0.05] border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                   : "border-transparent"
              }`}
            >
              <ParcelCard
                parcel={parcel}
                userInfo={userInfo}
                onDeliver={() => onDeliver && onDeliver({parcel,userInfo})}
                onRemove={() => onRemove && onRemove(parcel)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParcelList;
