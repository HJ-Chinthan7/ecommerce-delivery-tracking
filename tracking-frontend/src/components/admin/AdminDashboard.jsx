import { useState, useEffect } from "react";
import { useAdminAuth } from "../../AuthContext/AdminAuthContext";
import { adminAPI } from "../../services/api";
import DashboardHeader from "./DashboardHeader";
import MessageBox from "./MessageBox";
import OverviewTab from "./OverviewTab";
import DriversTab from "./DriversTab";
import BusesTab from "./BusesTab";
import ParcelsTab from "./ParcelsTab";
import RoutesTab from "./RoutesTab";
import AssignRoute from "./AssignRoute";
import { motion, AnimatePresence } from 'framer-motion';  //eslint-disable-line
import { clsx } from "clsx";  //eslint-disable-line
import { twMerge } from "tailwind-merge";   //eslint-disable-line
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  Package, 
  Map, 
  Network, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import TabItem from "./TabItem";
import { cn } from "../../utils/util";    //eslint-disable-line
const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [parcels, setParcels] = useState([]); // eslint-disable-line no-unused-vars

  const [registerDriverForm, setRegisterDriverForm] = useState({
    driverId: "",
    name: "",
    email: "",
    password: "",
  });
  const [assignBusForm, setAssignBusForm] = useState({
    driverId: "",
    busId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [driversRes, busesRes, parcelsRes] = await Promise.all([
        adminAPI.getRegionDrivers(),
        adminAPI.getRegionBuses(),
       adminAPI.getRegionParcels(),
      ]); 

      setDrivers(driversRes.data.drivers || []);
      setBuses(busesRes.data.buses || []);
      setParcels(parcelsRes.data.parcels || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDriver = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminAPI.registerDriver(registerDriverForm);
      if (response.data.success) {
        setMessage(
          "Driver registered successfully! Waiting for superadmin approval."
        );
        setRegisterDriverForm({
          driverId: "",
          name: "",
          email: "",
          password: "",
        });
        await loadData();
      }
    } catch (error) {
      console.error("Error registering driver:", error);
      setMessage(
        "Error registering driver: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBus = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    try {
      setLoading(true);
      const response = await adminAPI.assignBus(assignBusForm);
      if (response.data.success) {
        setMessage("Bus assigned to driver successfully!");
        setAssignBusForm({ driverId: "", busId: "" });
        await loadData();
      } else {
        setMessage("Failed to assign bus");
      }
    } catch (error) {
      console.error("Error assigning bus:", error);
      setMessage(
        "Error assigning bus: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };
  const approvedDrivers = drivers.filter((driver) => driver.status === 'approved');
  const pendingDrivers = drivers.filter((driver) =>  driver.status === 'pending');
 const tabConfig = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "drivers", name: "Manage Drivers", icon: Users },
    { id: "buses", name: "Manage Buses", icon: Bus },
    { id: "parcels", name: "Manage Parcels", icon: Package },
    { id: "routes", name: "Manage Routes", icon: Map },
    { id: "routesassign", name: "Assign Routes", icon: Network },
  ];
 if (loading && !drivers?.length) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-zinc-500" />
        </motion.div>
        <p className="mt-4 text-zinc-500 text-sm font-mono animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
      <div className="fixed top-0 right-0 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="relative z-10 bg-black/50 backdrop-blur-md border-b border-white/10">
        <DashboardHeader admin={admin} onRefresh={loadData} onLogout={logout} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar mask-image-fade">
          {tabConfig.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              label={tab.name}   
              icon={tab.icon}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {message && (
             <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
             >
               <MessageBox message={message} />
             </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="min-h-[600px] rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl shadow-black/50 p-6 md:p-8 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "overview" && (
                <OverviewTab
                  drivers={drivers}
                  buses={buses}
                  parcels={parcels}
                  pendingDrivers={pendingDrivers} 
                />
              )}

              {activeTab === "drivers" && (
                <DriversTab
                  drivers={drivers}
                  registerDriverForm={registerDriverForm}
                  setRegisterDriverForm={setRegisterDriverForm}
                  handleRegisterDriver={handleRegisterDriver}
                  loading={loading}
                />
              )}

              {activeTab === "buses" && (
                <BusesTab
                  buses={buses}
                  drivers={drivers}
                  assignBusForm={assignBusForm}
                  setAssignBusForm={setAssignBusForm}
                  handleAssignBus={handleAssignBus}
                  loading={loading}
                  approvedDrivers={approvedDrivers}
                />
              )}

              {activeTab === "parcels" && <ParcelsTab parcels={parcels} />}
              {activeTab === "routes" && <RoutesTab loading={loading} />}
              
              {activeTab === "routesassign" && <AssignRoute loading={loading} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );

};

export default AdminDashboard;