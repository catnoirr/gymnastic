// Page.jsx
'use client';
import React from "react";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FaShoppingCart, FaUsers, FaDollarSign ,FaClock } from "react-icons/fa";
export default function Page() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);  // State for user data
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        fetchUserData();  // Fetch user data once the user is authenticated
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/getUserData');  // Call the new API route
      const data = await response.json();

      if (response.ok) {
        setUserData(data);  // Set the user data if successful
      } else {
        setError(data.error || 'Error fetching user data');
      }
    } catch (error) {
      setError('Something went wrong while fetching user data');
    }
  };

  if (loading) return <p>Loading...</p>;


  return (
    <div className="h-screen bg-gray-100 w-full">

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">{userData?.name}</h2>
          <div className="flex space-x-4 items-center">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <i className="fas fa-bell text-gray-600"></i>
            </button>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards */}
            {[
              {
                title: "Total Sales",
                value: "$12,340",
                icon: <FaShoppingCart />,
                bg: "bg-green-100",
              },
              {
                title: "New Users",
                value: "1,245",
                icon: <FaUsers />,
                bg: "bg-blue-100",
              },
              {
                title: "Pending Orders",
                value: "85",
                icon: <FaClock />,
                bg: "bg-yellow-100",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`p-6 ${card.bg} rounded-lg shadow hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {card.title}
                  </h3>
                  <i className="text-2xl text-gray-500">{card.icon}</i>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Sales Overview
              </h3>
              <div className="mt-4 h-40 bg-gray-100 rounded"></div>
              {/* Replace with actual chart */}
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Users
              </h3>
              <div className="mt-4 h-40 bg-gray-100 rounded"></div>
              {/* Replace with actual chart */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
