import React from 'react';
import { Bus, User, Route as RouteIcon, MapPin, Package, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const BusesTab=({
  buses,
  drivers, // eslint-disable-line no-unused-vars
  assignBusForm,
  setAssignBusForm,
  handleAssignBus,
  loading,
  approvedDrivers
}) =>{
  const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full";
  const labelClass = "block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider";
  const selectWrapperClass = "relative group";
  const selectIconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-focus-within:text-white transition-colors";
  const selectClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all cursor-pointer";
  const btnPrimaryClass = "w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5";

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Bus className="text-green-400" size={20} />
            <h3 className="text-lg font-medium text-white">Assign Bus to Driver</h3>
          </div>

          <form onSubmit={handleAssignBus} className="space-y-6">
            <div>
              <label className={labelClass}>Select Driver</label>
              <div className={selectWrapperClass}>
                <User size={16} className={selectIconClass} />
                <select
                  value={assignBusForm.driverId}
                  onChange={(e) => setAssignBusForm({...assignBusForm, driverId: e.target.value})}
                  className={selectClass}
                  required
                >
                  <option value="" className="bg-zinc-900 text-zinc-500">Choose a driver...</option>
                  {approvedDrivers.map((driver) => (
                    <option key={driver._id} value={driver._id} className="bg-zinc-900 text-white">
                      {driver.name} ({driver.driverId})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                  <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1.5 ml-1">Only approved drivers are listed.</p>
            </div>
            <div>
              <label className={labelClass}>Select Bus</label>
              <div className={selectWrapperClass}>
                <Bus size={16} className={selectIconClass} />
                <select
                  value={assignBusForm.busId}
                  onChange={(e) => setAssignBusForm({...assignBusForm, busId: e.target.value})}
                  className={selectClass}
                  required
                >
                  <option value="" className="bg-zinc-900 text-zinc-500">Choose a bus...</option>
                  {buses.map((bus) => (
                    <option key={bus._id} value={bus._id} className="bg-zinc-900 text-white">
                      Bus {bus.busId} — {bus.routeId ? `Route: ${bus.routeId._id}` : "No Route"}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                  <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className={btnPrimaryClass}>
                {loading ? (
                   <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                   </>
                ) : (
                  <>
                    <span>Confirm Assignment</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className={`${cardClass} max-h-[600px]`}>
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Bus className="text-blue-400" size={20} />
              <h3 className="text-lg font-medium text-white">Region Buses</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
              {buses.length} VEHICLES
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar hover:pr-1 transition-all">
            {buses.length === 0 ? (
               <div className="h-40 flex flex-col items-center justify-center text-zinc-600">
                 <Bus size={32} strokeWidth={1} className="mb-2 opacity-50" />
                 <p className="text-sm">No buses registered in this region.</p>
               </div>
            ) : (
              buses.map((bus) => (
                <div key={bus._id} className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/5 text-zinc-300">
                        <Bus size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-white">Bus {bus.busId}</p>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                          <Calendar size={10} />
                          {bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded border ${
                      bus.isActive 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {bus.isActive ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1 flex items-center gap-1">
                        <User size={10} /> Assigned Driver
                      </p>
                      {bus?.driverId ? (
                        <div className="text-zinc-200  truncate">
                          {bus?.driverId?.name}
                          <span className="block text-[10px] text-zinc-500 font-mono truncate">{bus?.driverId?._id}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">Unassigned</span>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-right sm:text-left">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1 flex items-center gap-1 sm:justify-start justify-end">
                        <RouteIcon size={10} /> Route
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${bus?.routeId ? "bg-white/10 text-white" : "text-zinc-600"}`}>
                        {bus?.routeId?._id || "Not Assigned"}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1 flex items-center gap-1">
                        <MapPin size={10} /> Location
                      </p>
                      <span className="text-zinc-400 font-mono">
                        {bus?.currentLocation?.lat ? `${bus?.currentLocation?.lat?.toFixed(4)}, ${bus?.currentLocation?.lon?.toFixed(4)}` : 'Unknown'}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-right sm:text-left">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1 flex items-center gap-1 sm:justify-start justify-end">
                        <Package size={10} />Parcel Load
                      </p>
                      <span className="text-zinc-200">{bus.parcels?.length || 0} Parcels</span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BusesTab;