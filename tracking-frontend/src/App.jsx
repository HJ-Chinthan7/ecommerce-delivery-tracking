import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import BusDriverApp from "./components/BusDriverApp";
import PublicTracking from "./components/PublicBusTracking";
import Home from "./components/Home";
import { BusAuthProvider } from "./AuthContext/BusAuthContext";
import BusDriverLogin from "./components/BusDriverLogin";
import AdminRoutes from "./routes/AdminRoutes";
import { AdminAuthProvider } from "./AuthContext/AdminAuthContext";
import { AssignerAuthProvider } from "./AuthContext/AssignerAuthContext";
import AssignerLogin from "./components/parcel assigner/AssignerLogin";
import Assigner from "./components/parcel assigner/Assignment ";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login/*" element={
            <AdminAuthProvider>
            <AdminRoutes/>
            </AdminAuthProvider>
          }/>
          <Route
            path="/login"
            element={
              <BusAuthProvider>
                <BusDriverLogin />
              </BusAuthProvider>
            }
          />
          <Route path="/driver" element={
             <BusAuthProvider>
            <BusDriverApp />
            </BusAuthProvider>} />
          <Route path="/track/:parcelId" element={<PublicTracking />} />
           <Route path="/assigner-login" element={
             <AssignerAuthProvider>
            <AssignerLogin />
            </AssignerAuthProvider>} />

             <Route path="/assigner" element={
             <AssignerAuthProvider>
            <Assigner />
            </AssignerAuthProvider>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
