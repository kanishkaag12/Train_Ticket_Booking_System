import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("railway_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("railway_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("railway_user");
    }
  }, [user]);

  const login = (payload) => {
    localStorage.setItem("railway_token", payload.token);
    setUser({
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role
    });
  };

  const logout = () => {
    localStorage.removeItem("railway_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
