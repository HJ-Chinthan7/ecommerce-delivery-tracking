import { createContext, useContext, useState, useEffect } from "react";
import { assignerAPI } from "../services/api"; 
import { useNavigate } from "react-router-dom";

const AssignerAuthContext = createContext();

export const AssignerAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assigner, setAssigner] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("assignerToken") || null);

  useEffect(() => {
    if (token && !assigner) {
      const savedAssigner = localStorage.getItem("assigner");
      if (savedAssigner) setAssigner(JSON.parse(savedAssigner));
      setIsLoggedIn(true);
    }
  }, [token]);


  const login = async (credentials) => {
    try {
      const response = await assignerAPI.login(credentials);
      if (response.data.token) {
        const { token, assigner } = response.data;
        setAssigner(assigner);
        setToken(token);
        setIsLoggedIn(true);
        setMessage("Login successful!");
        localStorage.setItem("assignerToken", token);
        localStorage.setItem("assigner", JSON.stringify(assigner));
        navigate("/assigner"); 
      }
    } catch (error) {
      if (error.response) return error.response.data;
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      const response = await assignerAPI.logout();
      if (response.data.success) {
        setMessage("Logged out successfully");
        setAssigner(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("assignerToken");
        localStorage.removeItem("assigner");
        navigate("/assigner-login");
      }
    } catch (err) {
      setMessage("Logout failed. Try again.",err.message);
    }
  };

  return (
    <AssignerAuthContext.Provider
      value={{ assigner, message, setMessage, isLoggedIn, token, login, logout }}
    >
      {children}
    </AssignerAuthContext.Provider>
  );
};

export const useAssignerAuth = () => useContext(AssignerAuthContext);//eslint-disable-line
