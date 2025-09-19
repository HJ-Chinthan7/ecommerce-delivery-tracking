import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import SuperAdminDashboard from "../components/SuperAdminDashboard";
const AdminRoutes=()=> {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
    </Routes>
  );
}

export default AdminRoutes;