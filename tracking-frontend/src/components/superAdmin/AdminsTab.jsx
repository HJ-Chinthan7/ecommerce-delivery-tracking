import React from 'react';

const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all";
const btnPrimaryClass = "w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
const listDividerClass = "divide-y divide-white/5";
const listItemClass = "py-4 flex items-center justify-between group hover:bg-white/[0.02] -mx-4 px-4 transition-colors";

const AdminsTab = ({ createAdminForm, setCreateAdminForm, handleCreateAdmin, admins, regions, loading }) => {
  return (
    <div className="py-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-1 ${cardClass} h-fit`}>
        <h3 className="text-lg font-medium text-white mb-6">Create New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <input 
            placeholder="Full Name" 
            value={createAdminForm.name} 
            onChange={(e) => setCreateAdminForm({ ...createAdminForm, name: e.target.value })} 
            className={inputClass} 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={createAdminForm.email} 
            onChange={(e) => setCreateAdminForm({ ...createAdminForm, email: e.target.value })} 
            className={inputClass} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={createAdminForm.password} 
            onChange={(e) => setCreateAdminForm({ ...createAdminForm, password: e.target.value })} 
            className={inputClass} 
          />
          <div className="relative">
            <select 
              value={createAdminForm.regionId} 
              onChange={(e) => setCreateAdminForm({ ...createAdminForm, regionId: e.target.value })} 
              className={`${inputClass} appearance-none`}
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Select Region</option>
              {regions.map((r) => (
                <option key={r._id} value={r._id} className="bg-zinc-900 text-white">{r.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
          </div>
          
          <button type="submit" disabled={loading} className={`mt-4 ${btnPrimaryClass}`}>
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Create Admin'}
          </button>
        </form>
      </div>

      <div className={`lg:col-span-2 ${cardClass}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Admins List</h3>
          <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">{admins.length} TOTAL</span>
        </div>
        
        <div className="overflow-hidden">
          <ul className={listDividerClass}>
            {admins.map((admin) => (
              <li key={admin._id} className={listItemClass}>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-red-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{admin.name}</p>
                    <p className="text-xs text-zinc-500">{admin.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 m-5">Region</p>
                  <p className="text-sm text-zinc-200">{admin?.regionId?.name || '—'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminsTab;