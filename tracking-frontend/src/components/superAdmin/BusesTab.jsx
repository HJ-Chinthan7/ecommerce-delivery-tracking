import React from 'react';
import { Bus } from 'lucide-react';

const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all";
const btnPrimaryClass = "w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
const listDividerClass = "divide-y divide-white/5";
const listItemClass = "py-4 flex items-center justify-between group hover:bg-white/[0.02] -mx-4 px-4 transition-colors";

const BusesTab = ({ createBusForm, setCreateBusForm, handleCreateBus, buses, regions, admins, loading }) => {
  return (
    <div className="py-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-1 ${cardClass} h-fit`}>
        <h3 className="text-lg font-medium text-white mb-6">Register New Bus</h3>
        <form onSubmit={handleCreateBus} className="space-y-4">
          <input 
            placeholder="Bus Number / Plate" 
            value={createBusForm.busId} 
            onChange={(e) => setCreateBusForm({ ...createBusForm, busId: e.target.value })} 
            className={inputClass} 
          />
          <input 
            placeholder="Route Identifier" 
            value={createBusForm.routeId} 
            onChange={(e) => setCreateBusForm({ ...createBusForm, routeId: e.target.value })} 
            className={inputClass} 
          />
          
          <div className="relative">
            <select 
              value={createBusForm.regionId} 
              onChange={(e) => setCreateBusForm({ ...createBusForm, regionId: e.target.value })} 
              className={`${inputClass} appearance-none`}
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Select Region</option>
              {regions.map((r) => <option key={r._id} value={r._id} className="bg-zinc-900 text-white">{r.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
          </div>

          <div className="relative">
            <select 
              value={createBusForm.adminId} 
              onChange={(e) => setCreateBusForm({ ...createBusForm, adminId: e.target.value })} 
              className={`${inputClass} appearance-none`}
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Assign Admin</option>
              {admins.map((r) => <option key={r._id} value={r._id} className="bg-zinc-900 text-white">{r.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
          </div>

          <button type="submit" disabled={loading} className={`mt-4 ${btnPrimaryClass}`}>
            {loading ? 'Registering...' : 'Add Bus'}
          </button>
        </form>
      </div>
      <div className={`lg:col-span-2 ${cardClass}`}>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Bus Overview</h3>
            <Bus className="text-zinc-500" size={20}/>
        </div>
        
        <ul className={listDividerClass}>
          {buses.map((bus) => (
            <li key={bus?._id} className={listItemClass}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                   <Bus size={20} className="text-zinc-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Bus {bus?.busId}</p>
                  <p className="text-xs text-zinc-500">Route: {bus?.routeId || 'Unassigned'}</p>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-xs text-zinc-400">
                  <span className="text-zinc-600">Region:</span> {bus?.regionId?.name}
                </div>
                {bus?.adminId && (
                  <div className="text-xs text-zinc-400">
                    <span className="text-zinc-600">Admin:</span> {bus?.adminId?.name}
                  </div>
                )}
                {bus?.driverId && (
                   <div className="text-xs text-green-400">
                    Driver: {bus?.driverId?.name}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusesTab;