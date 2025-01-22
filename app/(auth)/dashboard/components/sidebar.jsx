"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaFire,
  FaChartBar,
  FaDumbbell,
  FaClock,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaWalking,
  FaSun,
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { deleteCookie } from '@/lib/cookies';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Move tabs and utilityTabs before useState
  const tabs = [
    { id: "home", icon: <FaSun />, tooltip: "Foocus", route: "/foocus" },
    { id: "calories", icon: <FaFire />, tooltip: "Diet", route: "/diet" },
    {
      id: "progress",
      icon: <FaWalking />,
      tooltip: "Today's Workout",
      route: "/today-workout",
    },
    {
      id: "workout",
      icon: <FaDumbbell />,
      tooltip: "Workout",
      route: "/workout",
    },
    { id: "timer", icon: <FaClock />, tooltip: "Reminder", route: "/reminder" },
  ];

  const utilityTabs = [
    {
      id: "notifications",
      icon: <FaBell />,
      tooltip: "Notifications",
      route: "/notifications",
    },
    // {
    //   id: "settings",
    //   icon: <FaCog />,
    //   tooltip: "Settings",
    //   route: "/settings",
    // },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const route = pathname;
    const tab = tabs.find(t => t.route === route);
    return tab ? tab.id : "home";
  });

  useEffect(() => {
    const currentTab = [...tabs, ...utilityTabs].find(tab => tab.route === pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      deleteCookie('token');
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="md:flex fixed flex-col items-center min-h-screen w-20 pb-2 hidden z-[999]">
      {/* Logo */}
      <div className="mb-6">
        <img src="/logo.png" alt="logo" className="w-16 h-16" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col space-y-6 border p-2 bg-white rounded-full">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => {
                setActiveTab(tab.id);
                router.push(tab.route);
              }}
              className={`text-lg text-black hover:text-white hover:bg-black rounded-full p-3 transition duration-300 ${
                activeTab === tab.id ? "bg-black text-white" : ""
              }`}
            >
              {tab.icon}
            </button>
            {/* Navigation Tabs Tooltip */}
            <span className="absolute left-14 top-1/2  transform -translate-y-1/2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
              {tab.tooltip}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-0.5 w-16 bg-gray-300 my-8"></div>

      {/* Utility Tabs */}
      <div className="flex flex-col space-y-6 bg-white border rounded-full p-2">
        {utilityTabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => {
                setActiveTab(tab.id);
                router.push(tab.route);
              }}
              className={`text-lg text-gray-500 hover:text-white hover:bg-black rounded-full p-3 transition duration-300 ${
                activeTab === tab.id ? "bg-gray-200 text-gray-800" : ""
              }`}
            >
              {tab.icon}
            </button>
            {/* Utility Tabs Tooltip */}
            <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
              {tab.tooltip}
            </span>
          </div>
        ))}

        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={handleSignOut}
            className="text-xl text-gray-500 hover:text-white hover:bg-red-600 rounded-full p-3 transition duration-300"
          >
            <FaSignOutAlt />
          </button>
          {/* Logout Tooltip */}
          <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
            Logout
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col space-y-6 mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src="/ab.jpg"
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
