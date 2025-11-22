import React from 'react';
import { UserPlus, Users, Hash, Mail, Lock, User, Bus, Calendar, CheckCircle2, Clock } from 'lucide-react';

const DriversTab=({
  drivers,
  registerDriverForm,
  setRegisterDriverForm,
  handleRegisterDriver,
  loading,
})=> {
 const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full";
  const labelClass = "block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider";
  const inputWrapperClass = "relative group";
  const inputIconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors";
  const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all";
  const btnPrimaryClass = "w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5";

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <UserPlus className="text-blue-400" size={20} />
            <h3 className="text-lg font-medium text-white">Register New Driver</h3>
          </div>
          
          <form onSubmit={handleRegisterDriver} className="space-y-5">
            <div>
              <label className={labelClass}>Driver ID</label>
              <div className={inputWrapperClass}>
                <Hash size={16} className={inputIconClass} />
                <input
                  type="text"
                  placeholder="e.g. DRV-2024-001"
                  value={registerDriverForm.driverId}
                  onChange={(e) => setRegisterDriverForm({...registerDriverForm, driverId: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Full Name</label>
              <div className={inputWrapperClass}>
                <User size={16} className={inputIconClass} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={registerDriverForm.name}
                  onChange={(e) => setRegisterDriverForm({...registerDriverForm, name: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <div className={inputWrapperClass}>
                <Mail size={16} className={inputIconClass} />
                <input
                  type="email"
                  placeholder="driver@company.com"
                  value={registerDriverForm.email}
                  onChange={(e) => setRegisterDriverForm({...registerDriverForm, email: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <div className={inputWrapperClass}>
                <Lock size={16} className={inputIconClass} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={registerDriverForm.password}
                  onChange={(e) => setRegisterDriverForm({...registerDriverForm, password: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className={btnPrimaryClass}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Register Driver'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className={`${cardClass} max-h-[600px]`}>
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Users className="text-green-400" size={20} />
              <h3 className="text-lg font-medium text-white">Region Drivers</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
              {drivers.length} TOTAL
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar hover:pr-1 transition-all">
            {drivers.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-zinc-600">
                <Users size={32} strokeWidth={1} className="mb-2 opacity-50" />
                <p className="text-sm">No drivers registered yet.</p>
              </div>
            ) : (
              drivers.map((driver) => (
                <div key={driver._id} className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10 text-zinc-300 font-medium text-sm">
                        {driver.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{driver.name}</p>
                        <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                           <Mail size={10} /> {driver.email}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded border ${
                      driver.status === 'approved' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {driver.status === 'approved' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {driver.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Driver ID</span>
                       <span className="text-xs text-zinc-300 font-mono bg-white/5 w-fit px-1.5 rounded">{driver.driverId || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                       <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Assigned Bus</span>
                       <div className="flex items-center justify-end gap-1 text-xs text-zinc-300">
                          <Bus size={12} className="text-zinc-500" />
                          {driver.busId || 'None'}
                       </div>
                    </div>
                  </div>
                  {driver.isApproved && driver.approvedAt && (
                    <div className="mt-2 text-[10px] text-zinc-600 flex items-center gap-1 justify-end">
                      <Calendar size={10} />
                      Approved: {new Date(driver?.approvedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriversTab;