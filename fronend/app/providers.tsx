"use client";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import RootRedirect from "./RootRedirect";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RootRedirect />
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}
