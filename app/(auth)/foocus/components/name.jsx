"use client";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Name() {
  const [userName, setUserName] = useState("Loading...");

  // Check localStorage after component mounts
  useEffect(() => {
    const cachedName = localStorage.getItem('cachedUserName');
    if (cachedName) {
      setUserName(cachedName);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const name = userData.name || user.email;
          setUserName(name);
          localStorage.setItem('cachedUserName', name);
        } else {
          setUserName(user.email);
          localStorage.setItem('cachedUserName', user.email);
        }
      } else {
        setUserName("Guest");
        localStorage.removeItem('cachedUserName');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-col items-center gap-2 p-3 bg-gray-100 rounded-full min-h-[200px] w-[60px] shadow-md hidden md:flex">
      <div className="relative">
        <UserCircle className="w-10 h-10 text-gray-400" />
      </div>
      <div className="flex flex-col items-center h-full justify-center">
        <div className="writing-vertical-lr transform rotate-90 text-gray-800 text-xl font-semibold tracking-wide">
          @{userName}
        </div>
      </div>
    </div>
  );
}
