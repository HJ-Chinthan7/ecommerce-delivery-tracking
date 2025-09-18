import { useState,useEffect } from "react";
import { useAuth } from "../AuthContext/BusAuthContext";
import BusDriverLogin from "./BusDriverLogin";
import Navbar from "./Navbar";
import Tabs from "./Tabs";
import BusMap from "./BusMap";
import RouteInfo from "./RouteInfo";
import DeliveriesTable from "./DeliveriesTable";

const BusDriverApp = () => {
  const { driver, logout ,setLocation} = useAuth();
  const {message,setMessage}=useState("")
  const [tracking, setTracking] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Map View");
 
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
        setMessage("Unable to get your location. Please enable location services.");
      },
      { enableHighAccuracy: true,
         timeout: 10000,
        maximumAge: 0 
      }
    );
  }, []);

  if (!driver) return <BusDriverLogin />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} logout={logout} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-6 max-w-7xl mx-auto">
         {message && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
            {message}
          </div>
        )}
        {activeTab === "Map View" && (
          <BusMap
            tracking={tracking}
            setTracking={setTracking}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        )}
        {activeTab === "Route List" && <RouteInfo />}
        {activeTab === "Parcels" && <DeliveriesTable />}
      </div>
    </div>
  );
};

export default BusDriverApp;
