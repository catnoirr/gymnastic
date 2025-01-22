"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase'; // Make sure this path matches your Firebase config file
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { setCookie, removeCookie } from '@/lib/cookies';

const GoogleSignIn = () => {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        // Update token periodically
        user.getIdToken(true).then((token) => {
          // Set secure HTTP-only cookies
          setCookie('userToken', token);
          setCookie('userEmail', user.email);
          setCookie('userName', user.displayName);
          setCookie('userPhoto', user.photoURL);
        });
      } else {
        setIsSignedIn(false);
        // Remove cookies on sign out
        removeCookie('userToken');
        removeCookie('userEmail');
        removeCookie('userName');
        removeCookie('userPhoto');
      }
    });

    return () => unsubscribe();
  }, []);
  
  const handleGoogleSignIn = async () => {
    if (isSignedIn) {
      router.push('/foocus');
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
    >
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <img 
          src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
          alt="Google" 
          className="w-5 h-5"
        />
        <span className="text-gray-700 font-medium">
          {isSignedIn ? 'Continue to App' : 'Sign in with Google'}
        </span>
      </button>
    </motion.div>
  );
};

export default GoogleSignIn; 