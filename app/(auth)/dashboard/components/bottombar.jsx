"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaSun,
  FaFire,
  FaRunning,
  FaSignOutAlt,
  FaDumbbell,
  FaUser,
  FaChartBar
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie } from '@/lib/cookies';
import ProfileEditDrawer from "./ProfileEditDrawer";

const BottomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Foocus", icon: <FaSun size={20} />, route: "/foocus" },
    { name: "Diet", icon: <FaFire size={20} />, route: "/diet" },
    { name: "Today", icon: <FaRunning size={20} />, route: "/today-workout" },
    { name: "Workout", icon: <FaDumbbell size={20} />, route: "/workout" },
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
      deleteCookie('token');
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

  // Add effect to handle body scroll
  useEffect(() => {
    if (showPopover) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopover]);

  // Add new state for ProfileEditDrawer
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Add handler for profile update
  const handleProfileUpdate = (updates) => {
    // You can add any additional logic here if needed
    setIsProfileDrawerOpen(false);
  };

  return (
    <>
      {/* Add ProfileEditDrawer */}
      <ProfileEditDrawer 
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onUpdate={handleProfileUpdate}
      />

      {/* Add backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-sm transition-all duration-300 z-30 ${
          showPopover ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowPopover(false)}
      />

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center px-4 py-2 md:space-x-4 z-40">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
              activeTab === tab.name
                ? "bg-white text-blue-600 shadow-lg"
                : "hover:bg-blue-600/30"
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
        
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowPopover(!showPopover)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 ml-4 bg-purple-700 hover:bg-purple-800 text-white rounded-full transition-all duration-300 ${
              showPopover ? 'ring-2 ring-white/80 scale-105 shadow-lg bg-purple-800' : ''
            }`}
          >
            <div className={`transition-all duration-300 ${showPopover ? 'rotate-180 scale-110' : ''}`}>
              <FaUser size={18} />
            </div>
          </button>

          <div className={`absolute bottom-full right-0 mb-6 transform transition-all duration-300 ${
            showPopover 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}>
            <div className="w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_25px_-8px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 shadow-inner">
                    <FaUser className="text-white/90" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-lg tracking-tight truncate">
                      {auth.currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-sm text-white/75 truncate font-medium">
                      {auth.currentUser?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-2 bg-gradient-to-b from-white via-white to-purple-50/30">
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(true);
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
                    router.push('/analytics');
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 hover:bg-purple-50/50 rounded-xl transition-all duration-200 group active:scale-98 mt-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:shadow-md transition-all duration-300 border border-purple-200/30">
                    <FaChartBar className="text-purple-600 transition-transform duration-300 group-hover:scale-110" size={18} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">Analytics</p>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-600">View your progress</p>
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
            
            <div className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 bg-white/95 backdrop-blur-xl border-r border-b border-white/20 shadow-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavBar;

