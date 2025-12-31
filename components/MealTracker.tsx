'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, BarChart3, Calendar } from 'lucide-react';
import {
  saveMealsForDate,
  getMealsForDate,
  getMealsForDateRange,
  getAllDishes,
  addDish as addDishToDB,
  updateDish as updateDishInDB,
  deleteDish as deleteDishFromDB,
  type DayMeals,
  type DishDBItem,
} from '@/lib/firestore';
import { TrackerView } from './TrackerView';
import { DashboardView } from './DashboardView';
import { DishDatabaseView } from './DishDatabaseView';

interface Dish {
  id: number;
  name: string;
  before: number;
  after: number;
}

interface Meal {
  time: string;
  dishes: Dish[];
}

export default function MealTracker() {
  const [view, setView] = useState<'tracker' | 'dashboard' | 'dishdb'>('tracker');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Record<string, Meal>>({
    meal1: { time: '08:00', dishes: [] },
    meal2: { time: '12:00', dishes: [] },
    meal3: { time: '16:00', dishes: [] },
    meal4: { time: '20:00', dishes: [] }
  });
  const [editingDish, setEditingDish] = useState<number | null>(null);
  const [showAddDish, setShowAddDish] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const getDefaultEndDate = () => new Date().toISOString().split('T')[0];
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split('T')[0];
  };
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [dishDatabase, setDishDatabase] = useState<DishDBItem[]>([]);

  useEffect(() => {
    loadDishDatabase();
  }, []);

  useEffect(() => {
    loadMealsForDate(selectedDate);
  }, [selectedDate]);

  const loadDishDatabase = async () => {
    try {
      const dishes = await getAllDishes();
      setDishDatabase(dishes);
    } catch (error) {
      console.error('Error loading dish database:', error);
    }
  };

  const loadMealsForDate = async (date: string) => {
    try {
      setLoading(true);
      const data = await getMealsForDate(date);
      if (data) {
        setMeals(data as any);
      } else {
        setMeals({
          meal1: { time: '08:00', dishes: [] },
          meal2: { time: '12:00', dishes: [] },
          meal3: { time: '16:00', dishes: [] },
          meal4: { time: '20:00', dishes: [] }
        });
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMeals = async () => {
    try {
      await saveMealsForDate(selectedDate, meals as any as DayMeals);
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  const addDish = (mealType: string, dish: Omit<Dish, 'id'>) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: [...prev[mealType].dishes, { ...dish, id: Date.now() }]
      }
    }));
    setShowAddDish(null);
    setTimeout(saveMeals, 100);
  };

  const updateDish = (mealType: string, dishId: number, updatedDish: Partial<Dish>) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: prev[mealType].dishes.map(d => d.id === dishId ? { ...d, ...updatedDish } : d)
      }
    }));
    setEditingDish(null);
    setTimeout(saveMeals, 100);
  };

  const deleteDish = (mealType: string, dishId: number) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: prev[mealType].dishes.filter(d => d.id !== dishId)
      }
    }));
    setTimeout(saveMeals, 100);
  };

  const clearMeal = (mealType: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: []
      }
    }));
    setTimeout(saveMeals, 100);
  };

  const updateMealTime = (mealType: string, time: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: { ...prev[mealType], time }
    }));
    setTimeout(saveMeals, 100);
  };

  const addDishToDatabase = async (dish: Omit<DishDBItem, 'id'>) => {
    try {
      const id = await addDishToDB(dish);
      setDishDatabase(prev => [...prev, { ...dish, id }].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  const updateDishInDatabase = async (dishId: string, updatedDish: Partial<DishDBItem>) => {
    try {
      await updateDishInDB(dishId, updatedDish);
      setDishDatabase(prev => 
        prev.map(d => d.id === dishId ? { ...d, ...updatedDish } as DishDBItem : d)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const deleteDishFromDatabase = async (dishId: string) => {
    try {
      await deleteDishFromDB(dishId);
      setDishDatabase(prev => prev.filter(d => d.id !== dishId));
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const validateDateRange = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const calculateCalories = (grams: number) => {
    return Math.round(grams * 1.2);
  };

  const getTodayStats = () => {
    let totalGrams = 0;
    Object.values(meals).forEach(meal => {
      meal.dishes.forEach(dish => {
        totalGrams += (dish.before - dish.after);
      });
    });
    return {
      grams: totalGrams,
      calories: calculateCalories(totalGrams)
    };
  };

  const getHistoricalData = async () => {
    try {
      const data = await getMealsForDateRange(startDate, endDate);
      return data.map(item => ({
        date: item.date,
        meals: item.meals
      }));
    } catch (error) {
      console.error('Error loading historical data:', error);
      return [];
    }
  };

  const updateDishInHistory = async (date: string, mealType: string, dishIndex: number, updatedDish: any) => {
    try {
      const dayData = await getMealsForDate(date);
      if (dayData) {
        const updatedMeals = { ...dayData };
        updatedMeals[mealType].dishes[dishIndex] = {
          ...updatedMeals[mealType].dishes[dishIndex],
          name: updatedDish.name,
          before: updatedDish.before,
          after: updatedDish.after
        };
        await saveMealsForDate(date, updatedMeals as any);
      }
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const deleteDishInHistory = async (date: string, mealType: string, dishIndex: number) => {
    try {
      const dayData = await getMealsForDate(date);
      if (dayData) {
        const updatedMeals = { ...dayData };
        updatedMeals[mealType].dishes.splice(dishIndex, 1);
        await saveMealsForDate(date, updatedMeals as any);
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-teal-600 text-center mb-3">🍼 Baby Meal Tracker</h1>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setView('tracker')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'tracker' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Calendar size={16} />
              Tracker
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'dashboard' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              <BarChart3 size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setView('dishdb')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'dishdb' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              📚 Dish DB
            </button>
          </div>

          {view === 'tracker' && (
            <>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-teal-200 rounded-xl focus:outline-none focus:border-teal-400 mb-2"
              />
              
              <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-3 rounded-xl flex justify-around">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Food</div>
                  <div className="text-xl font-bold text-teal-600">{todayStats.grams}g</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Calories</div>
                  <div className="text-xl font-bold text-emerald-600">{todayStats.calories} cal</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {loading && view === 'tracker' ? (
        <div className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>
      ) : view === 'tracker' ? (
        <TrackerView
          meals={meals}
          onAddDish={addDish}
          onUpdateDish={updateDish}
          onDeleteDish={deleteDish}
          onUpdateTime={updateMealTime}
          onClearMeal={clearMeal}
          showAddDish={showAddDish}
          setShowAddDish={setShowAddDish}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
          dishDatabase={dishDatabase}
        />
      ) : view === 'dashboard' ? (
        <DashboardView
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          validateDateRange={validateDateRange}
          getHistoricalData={getHistoricalData}
          onUpdateDishInHistory={updateDishInHistory}
          onDeleteDishInHistory={deleteDishInHistory}
        />
      ) : (
        <DishDatabaseView
          dishes={dishDatabase}
          onAddDish={addDishToDatabase}
          onUpdateDish={updateDishInDatabase}
          onDeleteDish={deleteDishFromDatabase}
        />
      )}
    </div>
  );
}
