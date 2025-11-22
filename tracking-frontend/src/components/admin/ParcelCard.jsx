import React from "react";
import { 
  Bus, 
  MapPin, 
  Trash2, 
  CheckCircle2,Box
} from 'lucide-react';
const ParcelCard = ({ parcel, selected, onSelect, type, toast }) => {
  const { shippingAddress } = parcel;

  const handleClick = () => {
    if (parcel.isAddressChanged && parcel.isDispatched) {
      toast?.error("Bruh, you can't select this. Update the dispatch status first.");
      return;
    }

    onSelect(parcel._id, type);
  };

return (
    <div
      onClick={handleClick}
      className={`relative group p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col gap-2 ${
        selected
          ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          : parcel.isAddressChanged
            ? "bg-yellow-500/5 border-yellow-500/30"
            : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      } ${parcel.isAddressChanged && parcel.isDispatched ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
             selected 
               ? "bg-blue-500 border-blue-500 text-white" 
               : parcel.isAddressChanged 
                  ? "border-yellow-500/50 text-transparent"
                  : "border-zinc-600 group-hover:border-zinc-400 text-transparent"
          }`}>
            {selected && <CheckCircle2 size={10} />}
          </div>
          
          {type === "region" && (
             <span className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                 <Trash2 size={10} /> REMOVE
             </span>
          )}

          <span className="font-mono text-xs text-zinc-300 truncate w-24">
            {parcel._id.substring(0, 12)}...
          </span>
        </div>
        
        <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${
           parcel.status === "assigned" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
           parcel.status === "in_transit" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
           parcel.status === "delivered" ? "bg-green-500/10 text-green-400 border-green-500/20" :
           "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
        }`}>
           {parcel.status.replace("_", " ")}
        </span>
      </div>

      <div className="pl-6 space-y-1">
        <div className="flex items-start gap-1.5">
             <MapPin size={12} className="text-zinc-500 mt-1.5 shrink-0" />
             <p className="text-sm text-zinc-300 line-clamp-1">Address: {shippingAddress?.address}</p>
        </div>
        <p className="text-[10px] text-zinc-500 pl-4 font-mono uppercase tracking-wide">
           City: {shippingAddress?.city}
        </p>
        <p className="text-[10px] text-zinc-500 pl-4 font-mono uppercase tracking-wide">
           District: {shippingAddress?.district}
        </p>
        <p className="text-[10px] text-zinc-500 pl-4 font-mono uppercase tracking-wide">
           State: {shippingAddress?.state} 
        </p>
        <p className="text-[10px] text-zinc-500 pl-4 font-mono uppercase tracking-wide">
          PostalCode: {shippingAddress?.postalCode}
        </p>
      </div>
      
      {parcel?.busId && (
        <div className="mt-1 pt-2 border-t border-white/5 pl-6 flex items-center gap-2 text-[10px] text-zinc-400">
            <Bus size={10} /> 
            <span>Bus: <span className="text-zinc-200 font-mono">{parcel.busId}</span>   </span>    <Box size={10} className="text-white" /><span className="text-zinc-200 font-mono">ParcelCity : {parcel?.shippingAddress?.city}</span>
        </div>
      )}
    </div>
  );
};

export default ParcelCard;
