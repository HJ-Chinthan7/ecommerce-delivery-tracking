import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/BusAuthContext";
import BusDriverLogin from "./BusDriverLogin";
import Navbar from "./Navbar";
import Tabs from "./Tabs";
import BusMap from "./BusMap";
import DeliveriesTable from "./DeliveriesTable";
import RouteInfoPage from "./RouteInfoPage";
import { motion, AnimatePresence } from 'framer-motion';  //eslint-disable-line
import { AlertCircle } from 'lucide-react';
import TabsContainer from "./TabsContainer";
const BusDriverApp = () => {
  const { driver, logout, setLocation } = useAuth();
  const { message, setMessage } = useState("");
  const [tracking, setTracking] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Map View");
  const [bus, setBus] = useState(null);
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!driver) return;

    if (!navigator.geolocation) {
      setMessage("Geolocation not supported by this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location:", err);
        setMessage(
          "Unable to get your location. Please enable location services."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  if (!driver) return <BusDriverLogin />;
 return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col relative overflow-hidden">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <Navbar driver={driver} logout={logout} />
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.1)] shrink-0 overflow-hidden"
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 min-h-0 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full relative"
            >
              {activeTab === "Map View" && (
                <div className="w-full h-full relative">
                  <BusMap
                    tracking={tracking}
                    setTracking={setTracking}
                    showAll={showAll}
                    setShowAll={setShowAll}
                    bus={bus}
                    route={route}
                  />
                </div>
              )}

              {activeTab === "Route List" && (
                <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
                  <RouteInfoPage
                    busId={driver?.bus?._id}
                    selectedEnd={selectedEnd}
                    selectedStart={selectedStart}
                    setSelectedEnd={setSelectedEnd}
                    setSelectedStart={setSelectedStart}
                    bus={bus}
                    setBus={setBus}
                    route={route}
                    setRoute={setRoute}
                  />
                </div>
              )}

              {activeTab === "Parcels" && (
                 <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
                    <DeliveriesTable busId={driver?.bus?._id} />
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default BusDriverApp;
