import axios from 'axios';

const API_BASE_URL =import.meta.env.VITE_APP_BASE_URL||'http://localhost:5002/api'; //  
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

export const superAdminAPI = {
  superAdminLogin: (credentials) => api.post('/superadmin/superAdminLogin', credentials),
  createAdmin: (adminData) => api.post('/superadmin/createadmin', adminData),
  approveDriver:(driverId)=>api.put(`/superadmin/approveDriver/${driverId}`),
  createRegion:(regionData)=>api.post('/superadmin/createregion',regionData),
  createBus:(busData)=>api.post('/superadmin/createbus',busData),
  superAdminLogout: () => api.post('/superadmin/superAdminLogout'),
  getAllAdmins: () => api.get('/superadmin/getAllAdmins'),
  getallDrivers: () => api.get('/superadmin/getAllDrivers'),
  getAllBuses: () => api.get('/superadmin/getAllBuses'),
  getAllRegions: () => api.get('/superadmin/getAllRegions'),
};

export const adminAPI = {
   adminLogin: (credentials) => api.post('/admin/adminLogin', credentials),
    adminLogout: () => api.post('/auth/adminLogout'),
};