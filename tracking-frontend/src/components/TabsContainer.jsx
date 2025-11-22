import React from "react";
import { motion } from "framer-motion";  //eslint-disable-line
import { Map as MapIcon, List, Package } from 'lucide-react';

const TabsContainer = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "Map View", icon: MapIcon },
    { id: "Route List", icon: List },
    { id: "Parcels", icon: Package }
  ];

  return (
    <div className="shrink-0 flex justify-center">
      <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${
              activeTab === tab.id ? "text-black" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="driver-active-tab"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon size={16} />
            <span>{tab.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default TabsContainer;
