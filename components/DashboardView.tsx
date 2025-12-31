'use client';

import React, { useState, useEffect } from 'react';
import { DayCard } from './DayCard';

interface DashboardViewProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  validateDateRange: (start: string, end: string) => boolean;
  getHistoricalData: () => Promise<any[]>;
}

export function DashboardView({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  validateDateRange,
  getHistoricalData,
}: DashboardViewProps) {
  const [dateError, setDateError] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    const historicalData = await getHistoricalData();
    
    // Sort by date
    const sortedData = historicalData.sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate calories for each dish
    const dataWithCalories = sortedData.map(day => ({
      ...day,
      meals: Object.fromEntries(
        Object.entries(day.meals).map(([mealType, meal]: [string, any]) => [
          mealType,
          {
            ...meal,
            dishes: meal.dishes.map((dish: any) => ({
              ...dish,
              grams: dish.before - dish.after,
              calories: Math.round((dish.before - dish.after) * 1.2)
            }))
          }
        ])
      )
    }));
    
    setData(dataWithCalories);
    setLoading(false);
  };

  const handleStartDateChange = (newStart: string) => {
    if (!validateDateRange(newStart, endDate)) {
      setDateError('Maximum 30 days allowed');
      return;
    }
    setDateError('');
    setStartDate(newStart);
  };

  const handleEndDateChange = (newEnd: string) => {
    if (!validateDateRange(startDate, newEnd)) {
      setDateError('Maximum 30 days allowed');
      return;
    }
    setDateError('');
    setEndDate(newEnd);
  };

  // Calculate totals
  const totalCalories = data.reduce((sum, day) => {
    let dayTotal = 0;
    Object.values(day.meals).forEach((meal: any) => {
      meal.dishes.forEach((dish: any) => dayTotal += dish.calories);
    });
    return sum + dayTotal;
  }, 0);
  const avgCalories = data.length > 0 ? Math.round(totalCalories / data.length) : 0;

  // Calculate meal averages
  const mealAverages: Record<string, number> = {
    meal1: 0,
    meal2: 0,
    meal3: 0,
    meal4: 0
  };
  
  data.forEach(day => {
    Object.entries(day.meals).forEach(([mealType, meal]: [string, any]) => {
      const mealCal = meal.dishes.reduce((sum: number, dish: any) => sum + dish.calories, 0);
      mealAverages[mealType] += mealCal;
    });
  });
  
  Object.keys(mealAverages).forEach(meal => {
    mealAverages[meal] = data.length > 0 ? Math.round(mealAverages[meal] / data.length) : 0;
  });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Date Range Selector */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <label className="block text-gray-600 font-semibold mb-2">Date Range (max 30 days):</label>
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              max={endDate}
              className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>
        {dateError && (
          <div className="text-red-500 text-sm mt-1">{dateError}</div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Average Daily Calories</div>
          <div className="text-3xl font-bold text-teal-600">{avgCalories} cal</div>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200">
          {Object.entries(mealAverages).map(([meal, cal]) => {
            const icons: Record<string, string> = { meal1: '🥣', meal2: '🍽️', meal3: '🥗', meal4: '🌮' };
            const labels: Record<string, string> = { meal1: 'Meal 1', meal2: 'Meal 2', meal3: 'Meal 3', meal4: 'Meal 4' };
            return (
              <div key={meal} className="text-center">
                <div className="text-lg">{icons[meal]}</div>
                <div className="text-xs text-gray-600">{labels[meal]}</div>
                <div className="text-sm font-bold text-teal-600">{cal} cal</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Details */}
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No data for selected date range
          </div>
        ) : (
          data.map((day, idx) => {
            const date = new Date(day.date);
            const dateLabel = date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            
            const dayTotal = Object.values(day.meals).reduce((sum: number, meal: any) => {
              return sum + meal.dishes.reduce((mealSum: number, dish: any) => mealSum + dish.calories, 0);
            }, 0);
            
            return (
              <DayCard 
                key={idx} 
                date={dateLabel} 
                meals={day.meals} 
                totalCalories={dayTotal}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
