import React from 'react';
import { MapPin } from 'lucide-react';

const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all";
const btnPrimaryClass = "w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
const listDividerClass = "divide-y divide-white/5";
const listItemClass = "py-4 flex items-center justify-between group hover:bg-white/[0.02] -mx-4 px-4 transition-colors";

const RegionsTab = ({ createRegionForm, setCreateRegionForm, handleCreateRegion, regions, loading }) => {
  return (
    <div className="py-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-1 ${cardClass} h-fit`}>
        <h3 className="text-lg font-medium text-white mb-6">Add Region</h3>
        <form onSubmit={handleCreateRegion} className="space-y-4">
          <input 
            placeholder="Region Name" 
            value={createRegionForm.name} 
            onChange={(e) => setCreateRegionForm({ ...createRegionForm, name: e.target.value })} 
            className={inputClass} 
          />
          <input 
            placeholder="Region Code (e.g. NY-01)" 
            value={createRegionForm.code} 
            onChange={(e) => setCreateRegionForm({ ...createRegionForm, code: e.target.value })} 
            className={inputClass} 
          />
          <button type="submit" disabled={loading} className={`mt-4 ${btnPrimaryClass}`}>
             {loading ? 'Processing...' : 'Add Region'}
          </button>
        </form>
      </div>

      <div className={`lg:col-span-2 ${cardClass}`}>
        <h3 className="text-lg font-medium text-white mb-6">Active Regions</h3>
        <ul className={listDividerClass}>
          {regions.map((region) => (
            <li key={region._id} className={listItemClass}>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400" />
                <p className="text-sm font-medium text-white">{region.name}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                {region.code}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegionsTab;