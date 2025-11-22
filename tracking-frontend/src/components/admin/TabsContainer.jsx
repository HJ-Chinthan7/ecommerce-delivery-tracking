import React, { useState } from "react";
import { motion } from "framer-motion";  //eslint-disable-line
const TabsContainer = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-2 mb-6 p-1.5 bg-white/[0.02] border border-white/10 rounded-full w-fit backdrop-blur-sm mx-auto sm:mx-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 rounded-full z-10 ${
              activeTab === tab.id 
                ? "text-black" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 bg-white rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {tab.name}
          </button>
        ))}
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children(activeTab)}
      </motion.div>
    </div>
  );
};

export default TabsContainer;
