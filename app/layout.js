"use client";
import { usePathname } from "next/navigation";
import './globals.css';
import Header from "@/components/navbar";

export default function RootLayout({ children }) {
  const path = usePathname();
  return (
    <html lang="en">
      <body>
        {path !== "/dashboard" && <header><Header /></header>}
        <main>{children}</main>
      </body>
    </html>
  );
}

