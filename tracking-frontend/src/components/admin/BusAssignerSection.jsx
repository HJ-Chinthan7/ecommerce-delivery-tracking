import React from "react";
import ParcelBusCard from "./ParcelBusCard";
import { 
  Search, 
  Bus
} from 'lucide-react';
const BusAssignerSection = ({ buses, selectedBus, onSelectBus, search, setSearch }) => {
return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col shadow-lg shadow-black/20">
       <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Bus size={18} className="text-green-400" />
            Select Bus
          </h3>
          <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
            {buses.length} available
          </span>
       </div>

       <div className="relative group mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search Route or Driver..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all"
          />
       </div>

       <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {buses.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
               <Bus size={24} className="opacity-40 mb-2" />
               <p className="text-xs">No buses found</p>
             </div>
          ) : (
            buses.map(bus => (
              <ParcelBusCard
                key={bus._id}
                bus={bus}
                selected={selectedBus === bus._id}
                onSelect={onSelectBus}
              />
            ))
          )}
       </div>
    </div>
  );
};

export default BusAssignerSection;
