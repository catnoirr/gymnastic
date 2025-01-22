"use client";
import { useState, useEffect } from "react";
import {
  FaSun,
  FaFire,
  FaWalking,
  FaSignOutAlt
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

const BottomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Foocus", icon: <FaSun size={20} />, route: "/foocus" },
    { name: "Diet", icon: <FaFire size={20} />, route: "/diet" },
    { name: "Workout", icon: <FaWalking size={20} />, route: "/today-workout" },
    { name: "Reminder", icon: <FaClock size={20} />, route: "/reminder" },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const currentTab = tabs.find(tab => tab.route === pathname);
    return currentTab ? currentTab.name : "Home";
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    router.push(tab.route);
  };

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.route === pathname);
    if (currentTab) {
      setActiveTab(currentTab.name);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Remove the token cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full shadow-lg flex items-center px-4 py-2 md:space-x-4 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => handleTabClick(tab)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
            activeTab === tab.name
              ? "bg-white text-gray-800 shadow-lg"
              : "hover:bg-gray-700"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform ${
              activeTab === tab.name ? "scale-110" : "scale-100"
            }`}
          >
            {tab.icon}
          </div>
          {activeTab === tab.name && (
            <span className="text-sm font-medium transition-opacity duration-300 opacity-100">
              {tab.name}
            </span>
          )}
        </button>
      ))}
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-3 py-2 ml-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-300"
      >
        <FaSignOutAlt size={20} />
        {/* <span className="text-sm font-medium">Sign Out</span> */}
      </button>
    </div>
  );
};

export default BottomNavBar;
