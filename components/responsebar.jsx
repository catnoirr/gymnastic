import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your auth instance from firebase.js
import BottomBar from "./BottomBar"; // Component for logged-in users
import NavBar from "./NavBar"; // Component for not logged-in users

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user exists, otherwise false
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  return (
    <div>
      {isLoggedIn ? <BottomBar /> : <NavBar />}
    </div>
  );
};

export default App;
