import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((cfg) => {
  const user = JSON.parse(localStorage.getItem("hotelpro_user") || "null");
  if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
  return cfg;
});

export const errMsg = (e) => e.response?.data?.message || e.message;
export default api;
