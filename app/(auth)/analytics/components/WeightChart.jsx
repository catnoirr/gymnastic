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

const WeightChart = ({ timeRange }) => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const weightRef = doc(db, 'users', user.uid, 'progress', 'weight');
    const unsubscribe = onSnapshot(weightRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const history = processWeightHistory(data.history || []);
        const filteredData = filterDataByTimeRange(history, timeRange);
        setWeightData(filteredData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  const processWeightHistory = (history) => {
    return history.map(entry => ({
      date: new Date(entry.date),
      weight: entry.weight,
      unit: 'kg' // Using kg as default unit
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
    labels: weightData.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Weight',
        data: weightData.map(entry => entry.weight),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
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
            const entry = weightData[context.dataIndex];
            return `Weight: ${entry.weight}${entry.unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `${value}${weightData[0]?.unit || 'kg'}`
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (weightData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No weight data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeightChart; 