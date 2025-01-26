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
  Legend
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
  Legend
);

const CalorieChart = ({ timeRange }) => {
  const [calorieData, setCalorieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const history = processCalorieHistory(userData.diet || [], userData.dailyStats);
        const filteredData = filterDataByTimeRange(history, timeRange);
        setCalorieData(filteredData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  const processCalorieHistory = (diet, dailyStats) => {
    // Group meals by date
    const mealsByDate = diet.reduce((acc, meal) => {
      if (meal.completed && meal.completedDate) {
        if (!acc[meal.completedDate]) {
          acc[meal.completedDate] = {
            calories: 0,
            target: dailyStats?.targetCalories || 3000
          };
        }
        acc[meal.completedDate].calories += parseInt(meal.totalCalories) || 0;
      }
      return acc;
    }, {});

    // Convert to array format
    return Object.entries(mealsByDate).map(([date, data]) => ({
      date: new Date(date),
      calories: data.calories,
      target: data.target
    })).sort((a, b) => a.date - b.date);
  };

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

    return data.filter(entry => entry.date >= ranges[range]);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const chartData = {
    labels: calorieData.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Calories Consumed',
        data: calorieData.map(entry => entry.calories),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Target Calories',
        data: calorieData.map(entry => entry.target),
        borderColor: 'rgba(34, 197, 94, 1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const entry = calorieData[context.dataIndex];
            const label = context.dataset.label;
            const value = context.raw;
            return `${label}: ${value} kcal`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `${value} kcal`
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (calorieData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No calorie data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CalorieChart; 