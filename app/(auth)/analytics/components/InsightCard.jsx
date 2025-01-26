"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoWarning, IoTrendingUp, IoTrendingDown, IoChevronDown } from 'react-icons/io5';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function InsightCard({ hasNewInsights, onView }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const newInsights = userData.insights || [];
        
        // Sort insights by date, newest first
        const sortedInsights = newInsights.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setInsights(sortedInsights);
        if (hasNewInsights && onView) {
          onView();
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [hasNewInsights, onView]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
      ))}
    </div>;
  }

  if (insights.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No insights available yet
      </div>
    );
  }

  const displayedInsights = showAll ? insights : insights.slice(0, 3);
  const hasMoreInsights = insights.length > 3;

  return (
    <div className="space-y-4">
      {displayedInsights.map((insight, index) => (
        <motion.div
          key={insight.id || index}
          initial={hasNewInsights && index === 0 ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-lg ${
            insight.type === 'warning' ? 'bg-red-50' :
            insight.type === 'success' ? 'bg-green-50' :
            'bg-blue-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {insight.type === 'warning' ? (
              <IoWarning className="w-5 h-5 text-red-500 mt-0.5" />
            ) : insight.type === 'success' ? (
              <IoCheckmarkCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : insight.trend === 'up' ? (
              <IoTrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
            ) : (
              <IoTrendingDown className="w-5 h-5 text-blue-500 mt-0.5" />
            )}
            <div>
              <p className="text-gray-800">{insight.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(insight.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      {hasMoreInsights && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"
        >
          {showAll ? 'Show Less' : 'Show More'}
          <IoChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
} 