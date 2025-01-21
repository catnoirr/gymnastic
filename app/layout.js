"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({ children }) {
  const path = usePathname();
  return (
    <html lang="en">
      <body>
        {/* {path !== "/dashboard" && path !== "/diet" && path !== "/adddiet" && (
          <header>
            <Header />
          </header>
        )} */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333", // Background color
              color: "#fff", // Text color
              padding: "10px 20px", // Padding
              borderRadius: "2rem", // Rounded corners
              fontSize: "16px", // Font size
            },
          }}
        />

        <HeroUIProvider>{children} </HeroUIProvider>
        {/* <main className="">{children}</main> */}
      </body>
    </html>
  );
}
