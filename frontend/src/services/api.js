import axios from "axios";

// For file upload (image, profile pic, bus image, etc.)
const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// For normal JSON requests
const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth config (Bearer token)
const authConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// APIs
export const createUserApi = (data) =>
  Api.post("/api/user/adduser", data);

export const loginUserApi = (data) =>
  Api.post("/api/user/loginuser", data);

//  ADD THIS (FIXES YOUR ERROR)
export const getMe = () =>
  Api.get("/api/user/getMe", authConfig);

export const deleteUserById = (id) =>
  Api.delete(`/api/user/delete/${id}`, authConfig);

export const getAllUserApi = () =>
  Api.get("/api/user/getAllUser", authConfig);

export const getUserById = (id) =>
  Api.get(`/api/user/${id}`, authConfig);

export const updateUserById = (id, data) =>
  Api.put(`/api/user/update/${id}`, data, authConfig);

export { Api, ApiFormData };
