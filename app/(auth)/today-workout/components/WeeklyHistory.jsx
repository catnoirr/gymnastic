import React, { useState, useEffect } from 'react';
import { db, auth } from "@/lib/firebase";
import { collection, doc, query, orderBy, getDocs } from "firebase/firestore";
import { IoBarbell, IoFitnessOutline, IoCalendarOutline } from "react-icons/io5";

export default function WeeklyHistory() {
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const historyRef = collection(doc(db, "users", userId), "history");
        const q = query(historyRef, orderBy("archivedAt", "desc"));
        const querySnapshot = await getDocs(q);

        const history = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWeeklyHistory(history);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading history...</div>;
  }

  if (weeklyHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <IoCalendarOutline className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-500">No workout history available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {weeklyHistory.map((week) => (
        <div key={week.id} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Week of {formatDate(week.startDate)}
            </h3>
            <span className="text-sm text-gray-500">
              {week.id}
            </span>
          </div>

          <div className="space-y-6">
            {Object.entries(week.weekData).map(([day, data]) => {
              const exercises = Object.values(data.workouts || {}).flatMap(
                workout => Object.values(workout.exercises || {})
              );

              if (exercises.length === 0) return null;

              return (
                <div key={day} className="border-t pt-4">
                  <h4 className="text-base font-medium text-gray-700 capitalize mb-3">
                    {day}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                            {exercise.name.toLowerCase().includes('bench') ? (
                              <IoBarbell className="w-5 h-5" />
                            ) : (
                              <IoFitnessOutline className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{exercise.name}</p>
                            <p className="text-sm text-gray-500">{exercise.workoutType}</p>
                          </div>
                        </div>
                        {exercise.sets?.length > 0 && (
                          <div className="space-y-1 mt-2">
                            {exercise.sets.map((set, setIdx) => (
                              <div key={setIdx} className="flex justify-between text-sm">
                                <span className="text-gray-600">Set {setIdx + 1}</span>
                                <span className="font-medium text-blue-600">
                                  {set.weight}kg × {set.reps}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 