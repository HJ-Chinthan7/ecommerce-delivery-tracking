import { useState, useEffect } from "react";
import { useAdminAuth } from "../../AuthContext/AdminAuthContext";
import { superAdminAPI } from "../../services/api";

import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import OverviewTab from "./OverviewTab";
import AdminsTab from "./AdminsTab";
import RegionsTab from "./RegionsTab";
import DriversTab from "./DriversTab";
import BusesTab from "./BusesTab";

function SuperAdminDashboard() {
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

  const pendingDrivers = drivers.filter((d) => d.status === "pending");
  const approvedDrivers = drivers.filter((d) => d.status === "approved");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        admin={admin}
        onRefresh={loadData}
        onLogout={superAdminLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

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
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
