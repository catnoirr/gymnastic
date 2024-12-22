"use client";
import { useState } from "react";
import { FaHome, FaChartBar, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Firebase auth import
import { signOut } from "firebase/auth"; // Import signOut from Firebase

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Sign-out function
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      style={{
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        position: "fixed",
      }}
      className={`bg-white shadow-md rounded-3xl transition-all duration-300 ${
        isHovered ? "w-64" : "w-32"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center justify-center py-2">
        {/* Initial Text */}
        {!isHovered && (
          <h1 className="text-orange-500 text-lg font-bold">Gymnastic</h1>
        )}
        {/* Icons Section */}
        {isHovered && (
          <nav className=" flex-1 w-full">
            <ul className=" flex  items-center justify-center gap-5">
              {[ 
                { name: "Overview", icon: <FaHome /> },
                { name: "Reports", icon: <FaChartBar /> },
                { name: "Settings", icon: <FaCog /> },
                { name: "Profile", icon: <FaUser /> },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className="flex items-center justify-center p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-all duration-300 rounded-full"
                  >
                    <span>{item.icon}</span>
                  </a>
                </li>
              ))}
              {/* Sign Out Button */}
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-all duration-300 rounded-full"
                >
                  <FaSignOutAlt /> {/* Sign Out Icon */}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
