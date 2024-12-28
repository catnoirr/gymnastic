"use client";

import React, { useState } from "react";
import { render } from "react-dom";
import { Line } from "react-chartjs-2";
import {
  Play,
  Moon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Circle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
function CircularProgress({
  percentage,
  size = 120,
  trackColor,
  progressColor,
}) {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
    </div>
  );
}
export default function FitnessDashboard() {
  const [activeSlide, setActiveSlide] = useState(0);
  const weightData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [81, 81.5, 82, 81.8, 82, 81.5, 82],
        borderColor: "rgb(147, 197, 253)",
        backgroundColor: "rgba(147, 197, 253, 0.1)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(147, 197, 253)",
        pointBorderWidth: 2,
      },
    ],
  };
  const weightOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "black",
        bodyColor: "black",
        borderColor: "rgb(229, 231, 235)",
        borderWidth: 1,
        padding: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
      y: {
        display: true,
        grid: {
          color: "rgb(243, 244, 246)",
        },
        ticks: {
          display: false,
        },
      },
    },
  };
  const sleepTips = [
    {
      id: 1,
      title: "Maintain a Regular Schedule",
      description: "Go to bed and wake up at the same time daily",
    },
    {
      id: 2,
      title: "Create a Relaxing Environment",
      description: "Keep your bedroom cool, dark and quiet",
    },
  ];
  const waterGlasses = Array(18).fill(null);
  const filledGlasses = 12;
  return (
    <main className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative rounded-3xl overflow-hidden bg-blue-50 p-8">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800"
          alt="Woman doing pushups"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Home Workout
            <br />
            Starts Here!
          </h1>
          <button className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors">
            Start Free Trial
            <ArrowRight size={20} />
          </button>
          <div className="mt-8 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                  alt="Member"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="text-white text-sm">5.8k+ Members</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-100 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Hydration Status</h2>
          <span className="text-3xl font-bold">
            2.15L<span className="text-sm font-normal">/Day</span>
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {waterGlasses.map((_, i) => (
            <Droplet
              key={i}
              className={`w-8 h-8 ${i < filledGlasses ? "text-blue-500" : "text-blue-200"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white px-3 py-1">D</button>
          <button className="rounded-full bg-white px-3 py-1">W</button>
          <button className="rounded-full bg-white px-3 py-1">M</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {[4, 5, 6].map((i) => (
              <img
                key={i}
                src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <h2 className="text-xl font-semibold">
            Experience the Goodness
            <br />
            of Deep Sleep
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Moon className="text-purple-500" />
          <span className="font-medium">Deep sleep</span>
        </div>
        <p className="text-gray-600 mb-4">
          {sleepTips[activeSlide].description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{activeSlide + 1}</span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev))
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() =>
                setActiveSlide((prev) =>
                  prev < sleepTips.length - 1 ? prev + 1 : prev,
                )
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Calories</h2>
            <p className="text-sm text-gray-500">Lack of physical activity</p>
          </div>
          <div className="text-right">
            <span className="text-sm">Daily dose</span>
            <p className="font-semibold">2,350 kCal</p>
          </div>
        </div>
        <div className="flex items-center justify-center mb-6">
          <CircularProgress
            percentage={85}
            trackColor="rgb(229, 231, 235)"
            progressColor="rgb(34, 197, 94)"
            aria-label="Calories progress"
            role="graphics"
          />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Carbohydrates</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                style={{
                  width: "75%",
                }}
                role="progressbar"
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Proteins</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{
                  width: "60%",
                }}
                role="progressbar"
                aria-valuenow={60}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Fats</span>
              <span className="text-sm font-medium">40%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                style={{
                  width: "40%",
                }}
                role="progressbar"
                aria-valuenow={40}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Weight</h2>
            <p className="text-sm text-gray-500">
              Healthy weight is 68 kg - 84 kg
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm">Tall body</span>
            <p className="font-semibold">188 cm</p>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-5xl font-bold">82</span>
          <span className="text-xl">kg</span>
        </div>
        <div
          className="h-32 mb-4"
          role="graphics"
          aria-label="Weekly weight trend"
        >
          <Line options={weightOptions} data={weightData} />
        </div>
        <p className="text-sm text-gray-500 text-right">
          Of the weekly
          <br />
          average weight
        </p>
      </div>
    </main>
  );
}

