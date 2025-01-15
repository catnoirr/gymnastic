"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/navbar";

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
        <main className="">{children}</main>
      </body>
    </html>
  );
}
