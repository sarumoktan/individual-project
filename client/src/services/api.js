import axios from "axios";

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// ===========================================AUTH=========================================================
export const registerApi = (data) => Api.post("/api/auth/register", data);
export const loginApi = (data) => Api.post("/api/auth/login", data);
export const getUser = () => Api.get(`api/auth/get`, config);
export const updateUserApi = (formData) => Api.put(`api/auth/update`, formData, config);


// ===========================================BUS=========================================================
export const addBusApi = (data) => ApiFormData.post("api/bus", data, config);
export const updateBusApi = (busId, data) => ApiFormData.put(`api/bus/${busId}`, data, config);
export const getAllBus = () => Api.get("api/bus", config);
export const getBusById = (data) => Api.get(`api/bus/${busId}/toggle`, data, config);
export const deleteBusApi = (busId) => Api.delete(`api/bus/${busId}`, config);
export const toggleBusApi = (id) => Api.patch(`/api/bus/${id}/toggle`, {}, config);


// ===========================================STAFF=========================================================
export const getAllStaff = () => Api.get("/api/staff", config);
export const addStaffApi = (fd) => ApiFormData.post("/api/staff", fd, config);
export const updateStaffApi = (id, fd) => ApiFormData.put(`/api/staff/${id}`, fd, config);
export const toggleStaffApi = (id) =>Api.patch(`/api/staff/${id}/toggle`,{}, config);
export const deleteStaffApi = (id) => Api.delete(`/api/staff/${id}`, config);


// ===========================================SCHEDULE=========================================================
export const getAllSchedules   = ()       => Api.get('/api/schedule', config);
export const addScheduleApi = (data) => Api.post("/api/schedule", data, config);
export const updateScheduleApi = (id, data) => Api.put(`/api/schedule/${id}`, data, config);
export const toggleScheduleApi = (id) => Api.patch(`/api/schedule/${id}/toggle`, {}, config);
export const deleteScheduleApi = (id) => Api.delete(`/api/schedule/${id}`, config);
export const searchSchedulesApi = (origin, destination, date) => Api.get(`/api/schedule/search?origin=${origin}&destination=${destination}&date=${date}`);


// ===========================================BOOKING=========================================================
export const bookTicketApi = (data) => Api.post("api/booking", data, config);
export const updateTicketApi = (id, seats) => Api.put(`api/booking/${id}`, { num_seats: seats }, config);
export const cancelTicketApi = (id) => Api.delete(`api/booking/${id}`, config);
export const fetchOccupancyApi = (scheduleId) => Api.get(`api/booking/occupancy/${scheduleId}`, config);
export const getUserBookingsApi = () => Api.get(`api/booking/get`, config);


// ===========================================STRIPE=========================================================
export const addStripeApi = (data) =>Api.post("api/payment", data, config);
