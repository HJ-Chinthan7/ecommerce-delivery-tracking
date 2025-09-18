import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
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
      const savedAdmin = localStorage.getItem("driver");
      if (savedAdmin) admin(JSON.parse(savedAdmin));
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await authAPI.busLogin(credentials);
    if (response.data.success) {
      const { token, driver} = response.data;
      setAdmin(driver);
      setToken(token);
      setIsLoggedIn(true);
      setMessage("Admin Login successful!");
      navigate("/driver");
      localStorage.setItem("token", token);
      localStorage.setItem("driver", JSON.stringify(admin));
  };

  const logout = async() => {
   const response=await authAPI.driverLogout();
    if(response.data.success){
      setMessage("Logged out successfully");
        setAdmin(null);
    setToken(null);
      setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
    }
    else{
      setMessage("Logout failed. Please try again.");
    }


  };

  return (
    <AdminAuthContext.Provider value={{ admin,message,setMessage,isLoggedIn, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
}


export const useAdminAuth = () => useContext(AdminAuthContext);