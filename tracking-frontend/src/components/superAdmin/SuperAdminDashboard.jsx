import { useState, useEffect } from "react";
import { useAdminAuth } from "../../AuthContext/AdminAuthContext";
import { superAdminAPI } from "../../services/api";
import DancingText from "../../utils/DancingText";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import OverviewTab from "./OverviewTab";
import AdminsTab from "./AdminsTab";
import RegionsTab from "./RegionsTab";
import DriversTab from "./DriversTab";
import BusesTab from "./BusesTab";
import { motion, AnimatePresence } from "framer-motion";   //eslint-disable-line
import { clsx } from "clsx";   //eslint-disable-line
import { twMerge } from "tailwind-merge";   //eslint-disable-line
import TabItem from "../admin/TabItem";
import {
  LayoutDashboard,
  ShieldCheck,
  Map,
  Users,
  Bus,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../utils/util";


const SuperAdminDashboard=()=> {
  const { admin, superAdminLogout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [admins, setAdmins] = useState([]);
  const [regions, setRegions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  const [createAdminForm, setCreateAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    regionId: "",
  });

  const [createRegionForm, setCreateRegionForm] = useState({
    name: "",
    code: "",
    superAdminEmail: "superadmin@example.com",
  });

  const [createBusForm, setCreateBusForm] = useState({
    routeId: null,
    regionId: "",
    busId: "",
    adminId: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [adminsRes, regionsRes, driversRes, busesRes] = await Promise.all([
        superAdminAPI.getAllAdmins(),
        superAdminAPI.getAllRegions(),
        superAdminAPI.getallDrivers(),
        superAdminAPI.getAllBuses(),
      ]);
      setAdmins(adminsRes.data.admins);
      setRegions(regionsRes.data.regions);
      setDrivers(driversRes.data.drivers);
      setBuses(busesRes.data.buses);
    } catch (error) {
      setMessage(
        `Error loading data: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await superAdminAPI.createAdmin(createAdminForm);
      setMessage("Admin created successfully!");
      setCreateAdminForm({ name: "", email: "", password: "", regionId: "" });
      loadData();
    } catch (error) {
      setMessage(
        `Error creating admin: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await superAdminAPI.createRegion(createRegionForm);
      setMessage("Region created successfully!");
      setCreateRegionForm({ name: "", description: "" });
      loadData();
    } catch (error) {
      setMessage(
        `Error creating region: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await superAdminAPI.createBus(createBusForm);
      setMessage("Bus created successfully!");
      setCreateBusForm({ routeId: null, regionId: "", busId: "", adminId: "" });
      loadData();
    } catch (error) {
      setMessage(
        `Error creating bus: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDriver = async (driverId) => {
    try {
      setLoading(true);
      await superAdminAPI.approveDriver(driverId);
      setMessage("Driver approved successfully!");
      loadData();
    } catch (error) {
      setMessage(
        `Error approving driver: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };
 const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admins', label: 'Admins', icon: ShieldCheck },
    { id: 'regions', label: 'Regions', icon: Map },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'buses', label: 'Buses', icon: Bus },
  ];
  const pendingDrivers = drivers.filter((d) => d.status === "pending");
  const approvedDrivers = drivers.filter((d) => d.status === "approved");
 return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-black to-zinc-500 flex items-center justify-center">
              <div className="h-3 w-3 bg-black rounded-full" />
            </div>
            <span className="text-lg font-serif font-medium tracking-tight">Super<span className="text-zinc-500"> Admin</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={loadData} 
              className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="h-4 w-px bg-white/10" />
            <button 
              onClick={superAdminLogout} 
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Operational
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-4">
            Hello, <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent font-medium">
              <DancingText text={admin?.name || "Super Admin"} />
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Manage your entire logistics network from a single point of control.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <TabItem 
              key={tab.id}
              {...tab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className={cn(
                "mb-8 p-4 rounded-xl border flex items-center gap-3 overflow-hidden",
                message.includes("Error")
                  ? "bg-red-500/10 border-red-500/20 text-red-200"
                  : "bg-green-500/10 border-green-500/20 text-green-200"
              )}
            >
              {message.includes("Error") ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="relative min-h-[600px] rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-black/50"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              

              {activeTab === "overview" && (
                <OverviewTab
                  regions={regions}
                  admins={admins}
                  drivers={drivers}
                  buses={buses}
                  pendingDrivers={pendingDrivers}
                  handleApproveDriver={handleApproveDriver}
                />
              )}

              {activeTab === "admins" && (
                <AdminsTab
                  createAdminForm={createAdminForm}
                  setCreateAdminForm={setCreateAdminForm}
                  handleCreateAdmin={handleCreateAdmin}
                  admins={admins}
                  regions={regions}
                  loading={loading}
                />
              )}

              {activeTab === "regions" && (
                <RegionsTab
                  createRegionForm={createRegionForm}
                  setCreateRegionForm={setCreateRegionForm}
                  handleCreateRegion={handleCreateRegion}
                  regions={regions}
                  loading={loading}
                />
              )}

              {activeTab === "drivers" && (
                <DriversTab
                  pendingDrivers={pendingDrivers}
                  approvedDrivers={approvedDrivers}
                  handleApproveDriver={handleApproveDriver}
                />
              )}

              {activeTab === "buses" && (
                <BusesTab
                  createBusForm={createBusForm}
                  setCreateBusForm={setCreateBusForm}
                  handleCreateBus={handleCreateBus}
                  buses={buses}
                  regions={regions}
                  loading={loading}
                  admins={admins}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
