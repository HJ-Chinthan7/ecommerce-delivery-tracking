import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import socketService from "../services/socket";
import { useNavigate } from "react-router-dom";
const BusAuthContext = createContext();

export const BusAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driver, setDriver] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && !driver) {
      const savedDriver = localStorage.getItem("driver");
      if (savedDriver) setDriver(JSON.parse(savedDriver));
      socketService.connect();
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await authAPI.busLogin(credentials);
    if (response.data.success) {
      const { token, driver:driverObject} = response.data;
      setDriver(driverObject);
      setToken(token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
      navigate("/driver");
      localStorage.setItem("token", token);
      localStorage.setItem("driver", JSON.stringify(driver));
      socketService.connect();
    }
  };

  const logout = () => {
    setDriver(null);
    setToken(null);
    localStorage.clear();
    socketService.disconnect();
  };

  return (
    <BusAuthContext.Provider value={{ driver,message,setMessage,isLoggedIn, token, login, logout }}>
      {children}
    </BusAuthContext.Provider>
  );
};

export const useAuth = () => useContext(BusAuthContext);
