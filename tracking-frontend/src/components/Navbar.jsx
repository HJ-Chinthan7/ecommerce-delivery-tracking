import { Bus, LogOut, User } from 'lucide-react';
const Navbar = ({ driver, logout }) => {
 return (
    <header className="relative z-20 shrink-0 h-20 border-b border-white/10 bg-black/50 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gradient-to-br from-black to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 border border-white/10">
          <Bus className="text-white" size={20} />
        </div>
        
        <div>
          <h1 className="text-lg font-serif font-medium tracking-tight leading-none text-white">
            Driver<span className="text-zinc-500"> DashBoard</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
              <User size={12} /> {driver?.name || "Driver"}
            </span>
            {driver?.bus && (
              <span className="text-[10px] bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                {driver.bus.busId}
              </span>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={logout}
        className="p-2.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
}
  


export default Navbar;
