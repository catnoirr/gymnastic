"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import BottomBar from "./bottombar"; // Import the BottomBar component

const ResponsiveUI = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check the window size on mount and whenever the window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    handleResize(); // Initial check on mount
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Sidebar for large screens */}
      <Sidebar />{" "}
      {/* Always render Sidebar, but it will be hidden on smaller screens */}
      {/* Bottom bar for small screens */}
      {isMobile && <BottomBar />}{" "}
      {/* Conditionally render BottomBar on small screens */}
    </div>
  );
};

export default ResponsiveUI;
