import React from "react";
import { 
  MapPin, 
  Navigation, 
  User, 
  Bus, 
  Activity, 
  ArrowRight,
} from 'lucide-react';
const CurrentStatusCard = ({ bus }) => {
  if (!bus) return null;
 return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
        <Activity className="text-blue-400" size={20} />
        <h3 className="text-lg font-medium text-white">Bus Status</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                <User size={16} />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Driver</p>
                <p className="text-sm font-medium text-white">{bus.driver ? bus.driver.name : "Not assigned"}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Bus size={16} />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Bus ID</p>
                <p className="text-sm font-medium text-white">{bus.busId}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Navigation size={16} />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Route & Direction</p>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium text-blue-400">{bus.RouteName || "N/A"}</span>
                   <span className="text-xs text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded capitalize">
                     {bus.direction || "forward"}
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                <MapPin size={16} />
             </div>
             <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Current Stop</p>
                <p className="text-sm font-medium text-white">
                  {bus.currentBusStop.name ? `${bus.currentBusStop.name} (Departed)` : "Not started"}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ArrowRight size={16} />
             </div>
             <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Next Stop</p>
                <p className="text-sm font-medium text-white">{bus.nextBusStop?.name || "End of Line"}</p>
             </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
             <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono mb-1">Stop #</p>
                <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-mono">
                   {bus.RouteOrderNo ?? 0}
                </span>
             </div>
             
             <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono mb-1">System Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                   bus.isActive 
                     ? "bg-green-500/10 border-green-500/20 text-green-400" 
                     : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${bus.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                   {bus.isActive ? "Active" : "Inactive"}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentStatusCard;
