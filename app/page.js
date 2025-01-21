"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWillHelp from "@/components/HowsItWork";
import About from "@/components/about";

export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        router.push("/diet");
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  return (
    <div className="bg-[#F5F5F5]">
      <Hero />
      <Features />
      <HowItWillHelp />
      <About />
    </div>
  );
}
