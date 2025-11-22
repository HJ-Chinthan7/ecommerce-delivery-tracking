import React from "react";
import { 
  User,
  CheckCircle2
} from 'lucide-react';
const ParcelBusCard = ({ bus, selected, onSelect }) => {
return (
    <div
      onClick={() => onSelect(bus._id)}
      className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
        selected
          ? "bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex justify-between items-center mb-1">
         <h4 className={`font-medium text-sm ${selected ? "text-green-400" : "text-white"}`}>
            {bus?.routeId?.name || " Route is not assigned"}
         </h4>
         {selected && <CheckCircle2 size={14} className="text-green-500" />}
      </div>
        <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
         {bus?.busId}
      </p>
      <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
         {bus?.routeId?.description || "No route description"}
      </p>
      
      <div className="flex items-center gap-2 text-[10px] text-zinc-400 bg-white/5 w-fit px-2 py-1 rounded border border-white/5">
         <User size={10} />
         <span>{bus.driverId?.name || "No Driver"}</span>
      </div>
    </div>
  );
};

export default ParcelBusCard;
