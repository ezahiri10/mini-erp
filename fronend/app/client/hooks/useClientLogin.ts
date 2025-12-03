import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useClientLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || "Login failed");
      }

      // Store credentials
      localStorage.setItem("clientToken", data.token);
      localStorage.setItem("clientUser", JSON.stringify(data.user));

      return data;
    } catch (err: any) {
      const message = err.message || "Login error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    router.push("/client/login");
  };

  const getToken = () => localStorage.getItem("clientToken");
  const getUser = () => {
    const user = localStorage.getItem("clientUser");
    return user ? JSON.parse(user) : null;
  };

  return {
    login,
    logout,
    getToken,
    getUser,
    loading,
    error,
  };
};
