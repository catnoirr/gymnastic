"use client";
import { useState } from "react";
import { FaHome, FaFileAlt, FaChartBar, FaSlidersH , FaSignOutAlt} from "react-icons/fa";

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: <FaHome size={20} /> },
    { name: "Files", icon: <FaFileAlt size={20} /> },
    { name: "Stats", icon: <FaChartBar size={20} /> },
    { name: "Settings", icon: <FaSlidersH size={20} /> },
    { name: "LogOut", icon: <FaSignOutAlt size={20} /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full shadow-lg flex items-center px-4 py-2 md:space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
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
    </div>
  );
};

export default BottomNavBar;
