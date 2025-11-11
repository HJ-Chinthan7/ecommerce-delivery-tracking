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
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (token && !driver) {
      const savedDriver = localStorage.getItem("driver");
      if (savedDriver) setDriver(JSON.parse(savedDriver));
      if (!socketService.connect) {
        socketService.connect(); 
        socketService.busDriverLogin(JSON.parse(savedDriver).busId);}
     
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await authAPI.busLogin(credentials);
    if (response.data.success) {
      const { token, driver} = response.data;
      setDriver(driver);
      setToken(token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
      navigate("/driver");
      localStorage.setItem("token", token);
      localStorage.setItem("driver", JSON.stringify(driver));
      if (!socketService.connect) {
        socketService.connect(); 
        socketService.busDriverLogin(driver.busId);}
    }
  };

  const logout = async() => {
  
      socketService.disconnect();
      socketService.busDriverLogout(driver.busId);
    if (!socketService.connected) {
     //see here i need to disconnect socket when logout i have done in the above without checking if it is connected or not i have to see the socket.connteced implemtation 
    } 
   const response=await authAPI.driverLogout();
    if(response.data.success){
      setMessage("Logged out successfully");
        setDriver(null);
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
    <BusAuthContext.Provider value={{ driver,message,setMessage,isLoggedIn, token, login, logout,setLocation,location }}>
      {children}
    </BusAuthContext.Provider>
  );
};

export const useAuth = () => useContext(BusAuthContext);
