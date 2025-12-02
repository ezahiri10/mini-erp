import { toast } from "react-toastify";

// /lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = API_URL;

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("authToken");
}

function getHeaders(isFormData = false) {
  const headers: Record<string, string> = {};
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

/**
 * apiFetch()
 */
export async function apiFetch(path: string, options: ApiOptions = {}) {
  const isFormData = options.body instanceof FormData;
  const url = `${API_URL}${path}`;

  console.log(`[API] ${options.method || 'GET'} ${url}`);

  const res = await fetch(url, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...getHeaders(isFormData),
      ...(options.headers || {}),
    },
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    console.warn("[API] Failed to parse JSON response");
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `API Error: ${res.status} ${res.statusText}`;
    console.error("[API Error]", message, data);
    throw new Error(message);
  }

  console.log(`[API] Success:`, data);
  return data;
}

/**
 * apiGet()
 */
export async function apiGet(endpoint: string) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[apiGet] ${url}`);
    
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          window.location.href = "/login";
        }
      }
      console.warn(`[API Warning] ${res.status} ${res.statusText} for ${endpoint}`);
      return [];
    }

    const data = await res.json();
    return data || [];
  } catch (err: any) {
    console.warn("[API Connection Error]", err.message);
    return [];
  }
}

/**
 * apiPost()
 */
export async function apiPost(endpoint: string, body: any) {
  try {
    const isFormData = body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`[apiPost] ${url}`, body);
    
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          window.location.href = "/login";
        }
      }
      
      const data = await res.json().catch(() => ({}));
      const message = data?.error || data?.message || `API Error: ${res.status} ${res.statusText}`;
      console.warn("[API Error]", message, data);
      throw new Error(message);
    }

    const data = await res.json();
    console.log(`[apiPost] Success:`, data);
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to submit request");
  }
}

/**
 * apiLogin()
 */
export async function apiLogin(email: string, password: string) {
  try {
    const url = `${API_BASE_URL}/auth/login`;
    console.log(`[apiLogin] POST ${url}`, { email, password: "***" });
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    console.log(`[apiLogin] Response Status: ${res.status} ${res.statusText}`);

    let data: any = null;
    try {
      data = await res.json();
    } catch (parseErr) {
      const text = await res.text();
      console.log(`[apiLogin] Response as text:`, text);
      data = { error: text || "Failed to parse response" };
    }

    console.log(`[apiLogin] Response Data:`, data);

    if (!res.ok) {
      const message = data?.error || data?.message || `Login failed: ${res.status} ${res.statusText}`;
      console.error("[apiLogin Error]", { 
        status: res.status, 
        statusText: res.statusText,
        message, 
        data 
      });
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
      throw new Error(message);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("[apiLogin] Token saved");
    }
    if (data.authToken) {
      localStorage.setItem("authToken", data.authToken);
      console.log("[apiLogin] AuthToken saved");
    }
    if (data.user?.role) {
      localStorage.setItem("userRole", data.user.role);
      console.log("[apiLogin] Role saved:", data.user.role);
    }

    console.log("[apiLogin] Success");
    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    return data;
  } catch (err: any) {
    console.error("[apiLogin Catch Error]", err);
    toast.error(err.message || "Login failed", {
      position: "top-right",
      autoClose: 5000,
    });
    throw new Error(err.message || "Login failed");
  }
}

/**
 * apiGetCurrentUser()
 * Get current logged-in user info
 */
export async function apiGetCurrentUser() {
  try {
    const url = `${API_BASE_URL}/auth/me`;
    console.log(`[apiGetCurrentUser] ${url}`);
    
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          window.location.href = "/login";
        }
      }
      console.error("[apiGetCurrentUser Error]", data);
      toast.error("Failed to fetch user info", {
        position: "top-right",
        autoClose: 5000,
      });
      return null;
    }

    console.log("[apiGetCurrentUser] Success");
    return data.user;
  } catch (err: any) {
    console.error("[apiGetCurrentUser Error]", err.message);
    toast.error("Error fetching user info", {
      position: "top-right",
      autoClose: 5000,
    });
    return null;
  }
}

/**
 * apiRegister()
 * NOTE: Registration endpoint is disabled on backend
 * Users are created by admins only via POST /api/admin/users
 */
export async function apiRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  console.warn("[apiRegister] Registration is disabled - contact your administrator");
  throw new Error("Registration is disabled. Please contact your administrator for access.");
}

/**
 * apiPatch()
 */
export function apiPatch(path: string, body?: any) {
  return apiFetch(path, { method: "PATCH", body });
}

/**
 * apiDelete()
 */
export function apiDelete(path: string) {
  return apiFetch(path, { method: "DELETE" });
}

/**
 * apiLogout()
 */
export async function apiLogout() {
  try {
    const url = `${API_BASE_URL}/auth/logout`;
    console.log(`[apiLogout] ${url}`);
    
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      console.warn(`[apiLogout] Logout failed: ${res.status}`);
      toast.warning("Logout incomplete", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userRole");
    }

    console.log("[apiLogout] Success");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    return true;
  } catch (err: any) {
    console.warn("[apiLogout Error]", err.message);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userRole");
    }
    toast.error("Error during logout", {
      position: "top-right",
      autoClose: 3000,
    });
    return true;
  }
}

/**
 * getUserRole()
 */
export function getUserRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userRole");
}

/**
 * hasRole()
 */
export function hasRole(allowedRoles: string[]) {
  const role = getUserRole();
  return role && allowedRoles.includes(role);
}
