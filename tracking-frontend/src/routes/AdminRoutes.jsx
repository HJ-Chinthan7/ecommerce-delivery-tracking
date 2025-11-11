import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/superAdmin/AdminLogin";
import SuperAdminDashboard from "../components/superAdmin/SuperAdminDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
const AdminRoutes=()=> {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AdminRoutes;