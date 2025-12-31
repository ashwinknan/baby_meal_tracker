import React, { useState } from 'react';

interface DayCardProps {
  date: string;
  meals: any;
  totalCalories: number;
}

export function DayCard({ date, meals, totalCalories }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mealIcons: Record<string, string> = { meal1: '🥣', meal2: '🍽️', meal3: '🥗', meal4: '🌮' };
  const mealNames: Record<string, string> = { meal1: 'Meal 1', meal2: 'Meal 2', meal3: 'Meal 3', meal4: 'Meal 4' };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Day Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex justify-between items-center transition-opacity hover:opacity-90"
      >
        <span className="font-bold text-lg">{date}</span>
        <span className="font-bold text-lg">{totalCalories} cal</span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-3">
          {Object.entries(meals).map(([mealType, meal]: [string, any]) => {
            const mealCalories = meal.dishes.reduce((sum: number, dish: any) => sum + dish.calories, 0);
            
            return (
              <div key={mealType} className="border-l-4 border-teal-400 pl-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">
                    {mealIcons[mealType]} {mealNames[mealType]}
                    <span className="text-sm text-gray-500 ml-2">{meal.time}</span>
                  </h3>
                  <span className="font-bold text-teal-600">{mealCalories} cal</span>
                </div>
                <div className="space-y-1">
                  {meal.dishes.map((dish: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm bg-teal-50 p-2 rounded">
                      <span className="text-gray-700">{dish.name}</span>
                      <span className="text-gray-500">{dish.grams}g • <strong className="text-teal-600">{dish.calories} cal</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
