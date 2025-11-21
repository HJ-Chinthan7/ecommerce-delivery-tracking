import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL||'http://localhost:5002/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
  approveDriver: (driverId) => api.put(`/superadmin/approveDriver/${driverId}`),
  createRegion: (regionData) => api.post('/superadmin/createregion', regionData),
  createBus: (busData) => api.post('/superadmin/createbus', busData),
  superAdminLogout: () => api.post('/superadmin/superAdminLogout'),
  getAllAdmins: () => api.get('/superadmin/getAllAdmins'),
  getallDrivers: () => api.get('/superadmin/getAllDrivers'),
  getAllBuses: () => api.get('/superadmin/getAllBuses'),
  getAllRegions: () => api.get('/superadmin/getAllRegions'),
};

export const adminAPI = {
  adminLogin: (credentials) => api.post('/admin/adminLogin', credentials),
  adminLogout: () => api.post('/admin/adminLogout'),
  getRegionDrivers: () => api.get('/admin/getRegionDrivers'),
  getRegionBuses: (regionId) => api.get(`/admin/getRegionBuses/${regionId}`),
  getRegionParcels: (regionId) => api.get(`/admin/getRegionParcels/${regionId}`),
  registerDriver: (driverData) => api.post('/admin/registerDriver', driverData),
  assignBus: (assignmentData) => api.put('/admin/assign-bus', assignmentData),
  createRoute: (routeData) => api.post('/route/createRoute', routeData),
  getRegionRoutes: () => api.get('/route/getRegionRoutes'),
  deleteRoute: (routeId) => api.delete(`/route/deleteRoute/${routeId}`),
  toggleRouteStatus: (routeId) => api.patch(`/route/toggleRouteStatus/${routeId}`),
  unAssignBusRoute: (busId) => api.patch(`/route/unAssignBusRoute/${busId}`),
  assignBusRoute: (assignmentData) => api.patch('/route/assignBusRoute', assignmentData),

  assignBusToParcels: ({ parcelIds, busId }) =>
    api.patch('/admin/assign-bus', { parcelIds, busId }),

  unassignParcelsFromBus: ({ parcelIds }) =>
    api.patch('/admin/unassign-bus', { parcelIds }),

  removeParcelsRegion: ({ parcelIds }) =>
    api.patch('/admin/remove-region', { parcelIds }),

  getUnassignedParcels: (regionId) => api.get(`/admin/parcels/unassigned/${regionId}`),
  getAssignedParcels: (regionId) => api.get(`/admin/parcels/assigned/${regionId}`),
  getAddressChangedParcels: (regionId) => api.get(`/admin/parcels/address-changed/${regionId}`),

};

export const driverAPI = {
  getBusRouteDetails: (busId) => api.get(`/driver/getBusRouteDetails/${busId}`),
  updateBusStop: (busId, data) => api.patch(`/driver/updateBusStop/${busId}`, data),
  sendNotification: (busId, data) => api.post(`/driver/sendNotification/${busId}`, data),
};

export const publicAPI = {
  getBusLocationtracking: (busId) => api.get(`/public-tracking/getBusLocationtracking/${busId}`),
};

export const assignerAPI = {
  login: (credentials) => api.post('/assigner/assignerLogin', credentials),
  logout: () => api.post('/assigner/assignerLogout'),
  assignParcel: (parcelData) => api.post('/assigner/assignParcel', parcelData),
  getParcels: () => api.get('/assigner/getParcels'),
  getRegions: () => api.get('/assigner/regions'),
  getReassignParcels: () => api.get('/assigner/parcels/reassign'),
  reassignParcel: (parcelData) => api.post('/assigner/reassignParcel', parcelData),

};

export const driverParcelsAPI = {
  getBusParcels: (busId) => api.get(`/driver/parcels/${busId}`),
  getUsersBatch: (userIds) => api.post(`/driver/users/batch`, { userIds }),

  markDelivered: (parcelId, email) => api.patch(`/driver/mark-delivered/${parcelId}`, { email }),
  generateDeliveryCode: async (parcelId) => {
    const res = await api.post(`/driver/generate-code`, { parcelId, type: "delivery" });
    return res.data;
  },
  verifyDeliveryCode: async (codeId, code) => {
    const res = await api.post(`/driver/verify-code`, { codeId, code });
    return res.data;
  },


  notifyWholeBus: (busId) => api.post(`/driver/notification/${busId}`),
  notifySelectedParcels: (busId, parcelIds) =>
    api.post(`/driver/notification-selected/${busId}`, { parcelIds }),
  generateCode: (payload) => api.post(`/driver/generate-code`, payload),
  verifyCode: (payload) => api.post(`/driver/verify-code`, payload),

  removeSelectedParcels: (payload) => api.patch(`/driver/remove-selected`, payload),

  removeAllParcels: (busId) => api.patch(`/driver/remove-all/${busId}`),
  
  generateRemoveCode: async (parcelId) => {
    const res = await api.post(`/driver/generate-code`, { parcelId, type: "remove" });
    return res.data;
  },
  verifyRemoveCode: async (codeId, code) => {
    const res = await api.post(`/driver/verify-code`, { codeId, code });
    return res.data;
  },

  generateRemoveAllCode: async (busId) => {
    const res = await api.post(`/driver/generate-code`, { busId, type: "remove_all" });
    return res.data;
  },
  verifyRemoveAllCode: async (codeId, code) => {
    const res = await api.post(`/driver/verify-code`, { codeId, code });
    return res.data;
  },

 //extra route
  removeParcel: (parcelId) => api.patch(`/driver/remove-parcel/${parcelId}`),


};