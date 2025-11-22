import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";  //eslint-disable-line
import { clsx } from "clsx";  //eslint-disable-line
import { twMerge } from "tailwind-merge"; //eslint-disable-line
import { cn } from "../../utils/util";

const Tabs = ({ tabs = [], children }) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id);
  useEffect(() => {
    if (tabs && tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-6 shrink-0">
        <nav
          className="relative inline-flex items-center p-1 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/20"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon; 

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
                  isActive
                    ? "text-zinc-950" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5" 
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-pill"
                    className="absolute inset-0 bg-zinc-100 rounded-full -z-10 shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                {Icon && <Icon size={16} className="relative z-10" />}
                <span className="relative z-10">{tab.name || tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {children && typeof children === "function"
              ? children(activeTab)
              : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;