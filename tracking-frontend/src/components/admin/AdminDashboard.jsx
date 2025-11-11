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
      const [driversRes, busesRes, parcelsRes] = await Promise.all([// eslint-disable-line no-unused-vars
        adminAPI.getRegionDrivers(),
        adminAPI.getRegionBuses(),
       // adminAPI.getRegionParcels(),
      ]); 

      setDrivers(driversRes.data.drivers || []);
      setBuses(busesRes.data.buses || []);
      //setParcels(parcelsRes.data.parcels || []);
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


  if (loading && !drivers.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader admin={admin} onRefresh={loadData} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "drivers", name: "Manage Drivers" },
              { id: "buses", name: "Manage Buses" },
              { id: "parcels", name: "Manage Parcels" },
              { id: "routes", name: "Manage Routes" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <MessageBox message={message} />

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

      </div>
    </div>
  );
};

export default AdminDashboard;