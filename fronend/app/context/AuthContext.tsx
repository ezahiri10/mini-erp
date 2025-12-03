"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR" | "CLIENT";
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const clientToken = localStorage.getItem("clientToken");
    const clientUser = localStorage.getItem("clientUser");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (clientToken && clientUser) {
      try {
        setToken(clientToken);
        setUser(JSON.parse(clientUser));
      } catch (error) {
        console.error("Failed to parse stored client user:", error);
        localStorage.removeItem("clientToken");
        localStorage.removeItem("clientUser");
      }
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
