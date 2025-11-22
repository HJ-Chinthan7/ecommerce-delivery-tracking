import React from 'react';
import { Users, Bus, Package, CheckCircle2, Clock, Activity } from 'lucide-react';

const OverviewTab = ({ drivers, buses, parcels}) => {
  
  const pendingDrivers = drivers.filter(d => d.status === 'pending');
  const approvedDrivers = drivers.filter(d => d.status === 'approved');

  const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
  const listItemClass = "p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors";

  return (
    <div className="py-2 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Total Drivers</p>
              <p className="text-2xl font-serif text-white">{drivers?.length || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Users className="text-blue-400" size={20} />
            </div>
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Approved</p>
              <p className="text-2xl font-serif text-white">{approvedDrivers?.length || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="text-green-400" size={20} />
            </div>
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Total Buses</p>
              <p className="text-2xl font-serif text-white">{buses?.length || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Bus className="text-yellow-400" size={20} />
            </div>
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Total Parcels</p>
              <p className="text-2xl font-serif text-white">{parcels?.length || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Package className="text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-gray-100 animate-pulse" />
            <h3 className="text-lg font-medium text-white">Pending Driver Approvals</h3>
          </div>

          {pendingDrivers.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <CheckCircle2 size={24} className="mb-2 opacity-50" />
              <p className="text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDrivers.slice(0, 5).map((driver) => (
                <div key={driver._id} className={listItemClass}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-zinc-200">{driver.name}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      <Clock size={10} /> Pending
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 font-mono">{driver.email}</p>
                    <p className="text-[10px] text-zinc-600 font-mono truncate">ID: {driver._id}</p>
                  </div>
                </div>
              ))}
              {pendingDrivers.length > 5 && (
                <p className="text-xs text-zinc-500 text-center pt-2">
                  +{pendingDrivers.length - 5} more requests...
                </p>
              )}
            </div>
          )}
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-blue-400" />
            <h3 className="text-lg font-medium text-white">Recent Bus Assignments</h3>
          </div>

          {buses.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <Bus size={24} className="mb-2 opacity-50" />
              <p className="text-sm">No buses in your region</p>
            </div>
          ) : (
            <div className="space-y-3">
              {buses.slice(0, 5).map((bus) => (
                <div key={bus._id} className={listItemClass}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center border border-white/5">
                         <Bus size={14} className="text-zinc-400" />
                       </div>
                       <p className="font-medium text-zinc-200">Bus {bus.busId}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${
                      bus.isActive 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Driver</p>
                      <p className="text-xs text-zinc-300 truncate">{bus?.driverId?.name || 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Route ID</p>
                      <p className="text-xs text-zinc-300 truncate font-mono">{bus?.routeId?._id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;