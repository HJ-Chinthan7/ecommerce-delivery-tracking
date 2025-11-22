import React from 'react';
import { LogOut, RefreshCw, Shield, MapPin } from 'lucide-react';

const DashboardHeader = ({ admin, onRefresh, onLogout }) => {
  return (
    <header className="w-full px-6 h-20 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-black to-zinc-500 flex items-center justify-center shadow-lg shadow-purple-900/20">
          <Shield className="bg-gradient-to-br" size={20} />
        </div>
        
        <div>
          <h1 className="text-lg font-serif font-bold tracking-tight text-white leading-none">
            Admin<span className="text-zinc-500">WorkSpace</span>
          </h1>
          
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium text-zinc-300">
              {admin?.name || 'Admin'}
            </span>
            {admin?.region && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <MapPin size={10} />
                {admin.region}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onRefresh} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/5"
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>
        
        <div className="h-6 w-px bg-white/10 mx-1" />
        
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-sm font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;