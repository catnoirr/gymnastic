"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FaUser,
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { deleteCookie } from "@/lib/cookies";
import ProfileEditDrawer from './ProfileEditDrawer';

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
  ];

  const utilityTabs = [
    {
      id: "analytics",
      icon: <FaChartBar />,
      tooltip: "Analytics",
      route: "/analytics",
    },
  ];

  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const currentTab = [...tabs, ...utilityTabs].find(
      (tab) => tab.route === pathname
    );
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      deleteCookie("token");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle body scroll
  useEffect(() => {
    if (showPopover) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopover]);

  // Add state for user data
  const [userData, setUserData] = useState({ displayName: 'User', email: '' });

  // Update user data when auth changes
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        displayName: user.displayName || 'User',
        email: user.email || ''
      });
    }
  }, []);

  // Add hover timer ref
  const hoverTimeoutRef = useRef(null);

  // Handle hover events
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopover(false);
    }, 300); // Small delay to make it feel smoother
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Add state for edit drawer
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Add handler for profile updates
  const handleProfileUpdate = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <>
      {/* Add backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-sm transition-all duration-300 z-30 ${
          showPopover ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowPopover(false)}
      />

      <div className="md:flex fixed flex-col items-center min-h-screen w-20 pb-2 hidden z-[999]">
        {/* Logo */}
        <div className="mb-6 mt-4">
          <img src="/logo.png" alt="logo" className="w-16 h-16 p-2  " />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col space-y-6 p-2 bg-white/10 backdrop-blur-sm rounded-full">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative group">
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(tab.route);
                }}
                className={`text-lg hover:text-white rounded-3xl p-3 transition duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/20"
                }`}
              >
                {tab.icon}
              </button>
              {/* Navigation Tabs Tooltip */}
              <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-black text-xs font-semibold px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
                {tab.tooltip}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-0.5 w-16 bg-white/20 my-8"></div>

        {/* Utility Tabs */}
        <div className="flex flex-col space-y-6 bg-white/10 backdrop-blur-sm rounded-full p-2">
          {utilityTabs.map((tab) => (
            <div key={tab.id} className="relative group">
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(tab.route);
                }}
                className={`text-lg hover:text-white rounded-full p-3 transition duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/20"
                }`}
              >
                {tab.icon}
              </button>
              {/* Utility Tabs Tooltip */}
              <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-black text-xs font-semibold px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
                {tab.tooltip}
              </span>
            </div>
          ))}

          {/* Logout Button */}
          <div className="relative group">
            <button
              onClick={handleSignOut}
              className="text-xl text-white/70 hover:text-white hover:bg-red-500/50 rounded-3xl p-3 transition duration-300"
            >
              <FaSignOutAlt />
            </button>
            {/* Logout Tooltip */}
            <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-black text-xs font-semibold px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-[999]">
              Logout
            </span>
          </div>
        </div>

        {/* Bottom Section with Popover */}
        <div 
          className="flex flex-col space-y-6 mt-auto mb-4" 
          ref={popoverRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setShowPopover(!showPopover)}
            className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${
              showPopover 
                ? 'border-white scale-105 shadow-lg' 
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <img
              src="/ab.jpg"
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
          </button>

          {/* Popover Menu */}
          <div 
            className={`absolute bottom-24 left-24 transform transition-all duration-300 ${
              showPopover 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 -translate-x-2 pointer-events-none'
            }`}
          >
            <div className="w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_25px_-8px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 shadow-inner">
                    <FaUser className="text-white/90" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-lg tracking-tight truncate">
                      {userData.displayName}
                    </p>
                    <p className="text-sm text-white/75 truncate font-medium">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-2 bg-gradient-to-b from-white via-white to-purple-50/30">
                <button
                  onClick={() => {
                    setIsEditDrawerOpen(true);
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 hover:bg-blue-50/50 rounded-xl transition-all duration-200 group active:scale-98"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border border-blue-200/30">
                    <FaUser className="text-blue-600 transition-transform duration-300 group-hover:scale-110" size={18} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Edit Profile</p>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-600">Update your information</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    handleSignOut();
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 hover:bg-red-50/50 rounded-xl transition-all duration-200 group active:scale-98 mt-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border border-red-200/30">
                    <FaSignOutAlt className="text-red-600 transition-transform duration-300 group-hover:scale-110" size={18} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">Logout</p>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-600">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
            
           
          </div>
        </div>
      </div>

      {/* Add the ProfileEditDrawer */}
      <ProfileEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
};

export default Sidebar;
