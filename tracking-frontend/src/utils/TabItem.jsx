import { cn } from "./util";
import { motion, AnimatePresence } from "framer-motion";//eslint-disable-line
const TabItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (//eslint-disable-line
  <button
    onClick={() => setActiveTab(id)}
    className={cn(
      "relative px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 rounded-full z-10",
      activeTab === id ? "text-black" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
    )}
  >
    {activeTab === id && (
      <motion.div
        layoutId="active-tab-pill"
        className="absolute inset-0 bg-white rounded-full -z-10"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <Icon size={16} />
    <span>{label}</span>
  </button>
);
export default TabItem;