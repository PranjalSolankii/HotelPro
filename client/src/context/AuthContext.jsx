import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("hotelpro_user") || "null"));

  const save = (u) => {
    localStorage.setItem("hotelpro_user", JSON.stringify(u));
    setUser(u);
  };
  const login = async (email, password) => save((await api.post("/auth/login", { email, password })).data);
  const register = async (name, email, password) => save((await api.post("/auth/register", { name, email, password })).data);
  const logout = () => {
    localStorage.removeItem("hotelpro_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
