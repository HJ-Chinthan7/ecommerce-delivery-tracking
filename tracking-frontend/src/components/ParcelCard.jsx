import { 
  Box, 
  MapPin, 
  Mail, 
  User, 
  Package, 
  AlertTriangle, 
  Trash2, 
  Truck
} from 'lucide-react';
const ParcelCard = ({
  parcel = {},
  userInfo = null,
  onDeliver = () => {},
  onRemove = () => {},
}) => {
  const address = parcel?.shippingAddress || {};

return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-200 group ${
        parcel?.isAddressChanged 
          ? "bg-red-500/5 border-red-500/30 hover:bg-red-500/10" 
          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 border border-white/5">
              <Package size={16} />
           </div>
           <div>
              <h3 className="font-mono text-sm font-medium text-white">
                #{parcel?.orderId ? parcel.orderId.slice(0, 8) : "—"}
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Order ID</p>
           </div>
        </div>

        {parcel?.isAddressChanged && (
          <span className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
            <AlertTriangle size={12} /> Address Changed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
         <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400">
               <User size={12} />
               <span>{userInfo?.username || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
               <Mail size={10} />
               <span>{userInfo?.email || "No Email"}</span>
            </div>
         </div>
         <div className="space-y-1">
            <div className="flex items-start gap-1.5 text-zinc-300">
               <Box size={12} className="mt-0.5 text-blue-400 shrink-0" />
               <span className="line-clamp-1">{parcel?.items?.[0]?.name || "Unknown Item"}</span>
            </div>
         </div>
      </div>

      <div className="bg-black/20 rounded-lg p-3 mb-4 border border-white/5">
         <div className="flex items-start gap-2">
            <MapPin size={14} className="text-zinc-500 mt-0.5 shrink-0" />
            <div>
               <p className="text-xs text-zinc-300 leading-relaxed">
                <span className="text-gray-400 "> Address: </span> {address?.address || "N/A"}
               </p>
               <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  City: {address?.city || "N/A"}
               </p>
               <p className="text-[10px] text-zinc-500 font-mono mt-1">
                 District: {address?.district || "N/A"}
               </p>
               <p className="text-[10px] text-zinc-500 font-mono mt-1">
                 State: {address?.state || "N/A"} 
               </p>
               <p className="text-[10px] text-zinc-500 font-mono mt-1">
                PostalCode:{address?.postalCode || "N/A"}
               </p>
            </div>
         </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={parcel?.isAddressChanged}
          onClick={(e) => { e.stopPropagation(); onDeliver(); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            parcel?.isAddressChanged 
               ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
               : "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
          }`}
        >
          <Truck size={14} />
          Deliver
        </button>

        {parcel?.isAddressChanged && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ParcelCard;
