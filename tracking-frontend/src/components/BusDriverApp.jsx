import { useState } from "react";
import { useAuth } from "../AuthContext/BusAuthContext";
import BusDriverLogin from "./BusDriverLogin";
import Navbar from "./Navbar";
import Tabs from "./Tabs";
import BusMap from "./BusMap";
import RouteInfo from "./RouteInfo";
import DeliveriesTable from "./DeliveriesTable";
const BusDriverApp = () => {
  const { driver, logout } = useAuth();
  console.log(driver);
  const [activeTab, setActiveTab] = useState("Map View");

  if (!driver) return <BusDriverLogin />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} logout={logout} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === "map" && <BusMap />}
        {activeTab === "route" && <RouteInfo />}
        {activeTab === "deliveries" && <DeliveriesTable />}
      </div>
    </div>
  );
};

export default BusDriverApp;
