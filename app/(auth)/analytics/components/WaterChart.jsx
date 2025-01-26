"use client";

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WaterChart = ({ timeRange }) => {
  const [waterData, setWaterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const history = userData.waterHistory || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Add today's data if it exists
        if (userData.waterStats && userData.waterStats.date === today) {
          history.push({
            currentLevel: userData.waterStats.currentLevel,
            targetLevel: userData.waterStats.targetLevel,
            date: today
          });
        }
        
        // Process and filter data based on timeRange
        const filteredData = filterDataByTimeRange(history, timeRange);
        setWaterData(filteredData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    const ranges = {
      '1W': new Date(now.setDate(now.getDate() - 7)),
      '1M': new Date(now.setMonth(now.getMonth() - 1)),
      '3M': new Date(now.setMonth(now.getMonth() - 3)),
      '6M': new Date(now.setMonth(now.getMonth() - 6)),
      '1Y': new Date(now.setFullYear(now.getFullYear() - 1)),
      'ALL': new Date(0)
    };

    return data
      .filter(entry => new Date(entry.date) >= ranges[range])
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const chartData = {
    labels: waterData.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Water Intake',
        data: waterData.map(entry => (entry.currentLevel / entry.targetLevel) * 100),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const entry = waterData[context.dataIndex];
            return `${entry.currentLevel}/${entry.targetLevel} glasses (${Math.round(context.raw)}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (waterData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No data available for selected time range</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WaterChart; 