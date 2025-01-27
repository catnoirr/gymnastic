"use client";
import { Toaster } from "react-hot-toast";
import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <HeroUIProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "2rem",
              fontSize: "16px",
            },
          }}
        />
        {children}
      </HeroUIProvider>
    </AuthProvider>
  );
} 