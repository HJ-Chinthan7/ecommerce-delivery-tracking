import axios from 'axios';

const API_BASE_URL ='http://localhost:5002/api'; //  import.meta.env.VITE_APP_BASE_URL||
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  busLogin: (credentials) => api.post('/auth/busLogin', credentials),
  registerDriver: (driverData) => api.post('/auth/registerDriver', driverData),
  driverLogout: () => api.post('/auth/driverLogout')
};

export const adminAPI = {
  adminLogin: (credentials) => api.post('/auth/adminLogin', credentials),
  registerAdmin: (adminData) => api.post('/auth/registerAdmin', adminData),
  adminLogout: () => api.post('/auth/adminLogout')
};