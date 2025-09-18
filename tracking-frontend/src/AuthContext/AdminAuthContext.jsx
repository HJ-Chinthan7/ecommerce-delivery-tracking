import { createContext, useContext, useState, useEffect } from "react";
import { adminAPI, authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && !admin) {
      const savedAdmin = localStorage.getItem("admin");
      if (savedAdmin) admin(JSON.parse(savedAdmin));
    }
  }, [token]);

 

    const logout = async() => {
    const response=await adminAPI.adminLogout();
        if(response.data.success){
        setMessage("Logged out successfully");
        setAdmin(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.clear();
        navigate("/admin/login");
        }
        else{
        setMessage("Logout failed. Please try again.");
        }


    };
    const login = async (credentials) => {
        const {role}=credentials;
         const response =(role)===('superadmin')? await adminAPI.superAdminLogin(credentials):await adminAPI.adminLogin(credentials);
        if (response.data.success) {
        const { token, admin} = response.data;
        setAdmin(admin);
        setToken(token);
        setIsLoggedIn(true);
        setMessage(`${role} Login successful!`);
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));
    };
    
    };
 return (
    <AdminAuthContext.Provider value={{ admin,message,setMessage,isLoggedIn, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}


export const useAdminAuth = () => useContext(AdminAuthContext);