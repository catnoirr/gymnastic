'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';  // Assuming you're importing Firebase setup
import { doc, getDoc } from 'firebase/firestore';
import { FaShoppingCart, FaUsers, FaDollarSign, FaClock } from "react-icons/fa";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // State for user data
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid); // Fetch user data once the user is authenticated
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid); // Reference to the current user's document in Firestore
      const docSnap = await getDoc(userRef); // Get the document

      if (docSnap.exists()) {
        setUserData(docSnap.data()); // Set user data
      } else {
        setError('User data not found');
      }
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="  mb-6 max-w-7xl mx-auto mt-2 ">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center rounded-3xl">
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
       
      </div>
    </div>
  );
}
