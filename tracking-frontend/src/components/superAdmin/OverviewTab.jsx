import React from 'react';
import { Users, MapPin, Bus, ShieldCheck, Check } from 'lucide-react';

const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
const listDividerClass = "divide-y divide-white/5";
const listItemClass = "py-4 flex items-center justify-between group hover:bg-white/[0.02] -mx-4 px-4 transition-colors";
const btnOutlineClass = "px-4 py-2 rounded-lg border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/10 transition-colors";

const OverviewTab = ({ regions, admins, drivers, buses, pendingDrivers, handleApproveDriver }) => {
  const stats = [
    { label: "Total Regions", value: regions.length, icon: MapPin, color: "text-blue-400" },
    { label: "Active Admins", value: admins.length, icon: ShieldCheck, color: "text-red-400" },
    { label: "Total Drivers", value: drivers.length, icon: Users, color: "text-yellow-400" },
    { label: "Total Bus", value: buses.length, icon: Bus, color: "text-green-400" },
  ];

  return (
    <div className="py-2 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/[0.03] border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-colors">
            <div>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-serif text-white">{stat.value}</p>
            </div>
            <stat.icon className={`${stat.color} opacity-80`} size={24} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-lg font-medium text-white">Pending Approvals</h3>
          </div>
          
          {pendingDrivers.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
              <Check size={20} className="mb-2 opacity-50" />
              <p className="text-sm">0</p>
            </div>
          ) : (
            <ul className={listDividerClass}>
              {pendingDrivers.map((driver) => (
                <li key={driver._id} className={listItemClass}>
                  <div>
                    <p className="text-sm font-medium text-white">{driver.name}</p>
                  </div>
                  <button onClick={() => handleApproveDriver(driver._id)} className={btnOutlineClass}>
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={cardClass}>
          <h3 className="text-lg font-medium text-white mb-6">Recent Admins</h3>
          <ul className={listDividerClass}>
            {admins.slice(0, 5).map((admin) => (
              <li key={admin._id} className={listItemClass}>
                <div>
                  <p className="text-sm font-medium text-white">{admin.name}</p>
                  <p className="text-xs text-zinc-500">{admin.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-300 border border-white/5">
                  {admin.regionId?.name || 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
