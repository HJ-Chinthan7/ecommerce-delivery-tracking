import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/admins/AdminLogin";
import SuperAdminDashboard from "../components/admins/SuperAdminDashboard";
const AdminRoutes=()=> {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
    </Routes>
  );
}

export default AdminRoutes;