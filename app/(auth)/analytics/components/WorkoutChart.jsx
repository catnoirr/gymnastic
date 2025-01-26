"use client";

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WorkoutChart = ({ timeRange }) => {
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatDayAndDate = (date, dayName) => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    return `${dayName} ${formatDate(date)}${isToday ? ' (Today)' : ''}`;
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const history = processWorkoutHistory(userData);
        const filteredData = filterDataByTimeRange(history, timeRange);
        setWorkoutData(filteredData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  const processWorkoutHistory = (userData) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const workoutHistory = [];

    // Process each day's workout data
    days.forEach((day, index) => {
      // Calculate the date for this day
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - ((today.getDay() - index + 7) % 7));
      const dateStr = dayDate.toISOString().split('T')[0];

      // First check workoutHistory for this date
      if (userData.workoutHistory?.[dateStr]?.isCompleted) {
        workoutHistory.push({
          date: dateStr,
          completion: 100,
          completed: 1,
          total: 1,
          dayName: day.charAt(0).toUpperCase() + day.slice(1)
        });
        return;
      }

      // If not in history, check the day's workouts
      if (userData[day]?.workouts) {
        const dayWorkouts = userData[day].workouts;
        
        // Count total exercises and completed exercises across all workout types
        let totalExercises = 0;
        let completedExercises = 0;

        // Iterate through each workout type
        Object.values(dayWorkouts).forEach(workout => {
          const exercises = Object.values(workout.exercises || {});
          totalExercises += exercises.length;
          completedExercises += exercises.filter(ex => ex.isCompleted).length;
        });

        if (totalExercises > 0) {
          workoutHistory.push({
            date: dateStr,
            completion: (completedExercises / totalExercises) * 100,
            completed: completedExercises,
            total: totalExercises,
            dayName: day.charAt(0).toUpperCase() + day.slice(1)
          });
        }
      }
    });

    return workoutHistory;
  };

  const filterDataByTimeRange = (data, range) => {
    // For workout data, we'll show the most recent data points based on the range
    const dataPoints = {
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': data.length
    };

    return data.slice(-dataPoints[range]);
  };

  const chartData = {
    labels: workoutData.map(entry => formatDayAndDate(entry.date, entry.dayName)),
    datasets: [
      {
        label: 'Workout Completion',
        data: workoutData.map(entry => entry.completion),
        backgroundColor: workoutData.map(entry => {
          const today = new Date().toISOString().split('T')[0];
          return entry.date === today 
            ? 'rgba(59, 130, 246, 0.8)' // Blue for today
            : entry.completion === 100 
              ? 'rgba(34, 197, 94, 0.8)' // Green for completed
              : 'rgba(156, 163, 175, 0.8)'; // Gray for others
        }),
        borderRadius: 6,
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
          title: (context) => {
            const entry = workoutData[context[0].dataIndex];
            return formatDayAndDate(entry.date, entry.dayName);
          },
          label: (context) => {
            const entry = workoutData[context.dataIndex];
            const lines = [
              `Completion: ${Math.round(entry.completion)}%`,
              `Exercises: ${entry.completed}/${entry.total}`
            ];
            if (entry.completion === 100) {
              lines.push('✅ All exercises completed');
            }
            return lines;
          }
        },
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            size: 12
          },
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6b7280'
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        top: 10,
        right: 16,
        bottom: 10,
        left: 16
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (workoutData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No workout data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WorkoutChart; 