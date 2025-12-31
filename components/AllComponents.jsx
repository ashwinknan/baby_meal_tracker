import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, BarChart3, Calendar } from 'lucide-react';

export default function BabyMealTracker() {
  const [view, setView] = useState('tracker'); // 'tracker', 'dashboard', or 'dishdb'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({
    meal1: { time: '08:00', dishes: [] },
    meal2: { time: '12:00', dishes: [] },
    meal3: { time: '16:00', dishes: [] },
    meal4: { time: '20:00', dishes: [] }
  });
  const [editingDish, setEditingDish] = useState(null);
  const [showAddDish, setShowAddDish] = useState(null);
  
  // Dashboard date range (last 7 days by default)
  const getDefaultEndDate = () => new Date().toISOString().split('T')[0];
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 6); // 7 days including today
    return date.toISOString().split('T')[0];
  };
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  // Dish Database
  const [dishDatabase, setDishDatabase] = useState([
    { id: 1, name: 'Rice porridge', caloriesPer100g: 85 },
    { id: 2, name: 'Banana mash', caloriesPer100g: 89 },
    { id: 3, name: 'Sweet potato', caloriesPer100g: 90 }
  ]);

  const addDishToDatabase = (dish) => {
    setDishDatabase(prev => [...prev, { ...dish, id: Date.now() }]);
  };

  const updateDishInDatabase = (dishId, updatedDish) => {
    setDishDatabase(prev => prev.map(d => d.id === dishId ? { ...d, ...updatedDish } : d));
  };

  const deleteDishFromDatabase = (dishId) => {
    setDishDatabase(prev => prev.filter(d => d.id !== dishId));
  };

  const validateDateRange = (start, end) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = Math.abs(endD - startD);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  // Mock historical data (replace with Firestore data later)
  const getHistoricalData = () => {
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dishNames = ['Rice porridge', 'Banana mash', 'Sweet potato', 'Chicken puree', 'Carrot soup', 'Apple sauce'];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      // Mock data - replace with actual Firestore queries
      const dayMeals = {
        meal1: {
          time: '08:00',
          dishes: [
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 50) + 50, calories: 0 },
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 40) + 30, calories: 0 }
          ]
        },
        meal2: {
          time: '12:30',
          dishes: [
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 60) + 60, calories: 0 },
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 40) + 30, calories: 0 }
          ]
        },
        meal3: {
          time: '16:00',
          dishes: [
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 50) + 50, calories: 0 }
          ]
        },
        meal4: {
          time: '20:00',
          dishes: [
            { name: dishNames[Math.floor(Math.random() * dishNames.length)], grams: Math.floor(Math.random() * 45) + 40, calories: 0 }
          ]
        }
      };
      
      // Calculate calories for each dish
      Object.values(dayMeals).forEach(meal => {
        meal.dishes.forEach(dish => {
          dish.calories = Math.round(dish.grams * 1.2);
        });
      });
      
      data.push({
        date: dateStr,
        meals: dayMeals
      });
    }
    return data;
  };

  const calculateCalories = (grams) => {
    // Average baby food is ~1.2 calories per gram
    // This can be customized per dish type later
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

  const addDish = (mealType, dish) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: [...prev[mealType].dishes, { ...dish, id: Date.now() }]
      }
    }));
    setShowAddDish(null);
  };

  const updateDish = (mealType, dishId, updatedDish) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: prev[mealType].dishes.map(d => d.id === dishId ? { ...d, ...updatedDish } : d)
      }
    }));
    setEditingDish(null);
  };

  const deleteDish = (mealType, dishId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        dishes: prev[mealType].dishes.filter(d => d.id !== dishId)
      }
    }));
  };

  const updateMealTime = (mealType, time) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: { ...prev[mealType], time }
    }));
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-teal-600 text-center mb-3">🍼 Baby Meal Tracker</h1>
          
          {/* View Toggle */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setView('tracker')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'tracker' 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Calendar size={16} />
              Tracker
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'dashboard' 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <BarChart3 size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setView('dishdb')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-sm ${
                view === 'dishdb' 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              📚
              Dish DB
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
              
              {/* Today's Stats */}
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

      {/* Content */}
      {view === 'tracker' ? (
        <TrackerView
          meals={meals}
          onAddDish={addDish}
          onUpdateDish={updateDish}
          onDeleteDish={deleteDish}
          onUpdateTime={updateMealTime}
          showAddDish={showAddDish}
          setShowAddDish={setShowAddDish}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
        />
      ) : view === 'dashboard' ? (
        <DashboardView
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          validateDateRange={validateDateRange}
          data={getHistoricalData()}
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

function TrackerView({ meals, onAddDish, onUpdateDish, onDeleteDish, onUpdateTime, showAddDish, setShowAddDish, editingDish, setEditingDish }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {Object.entries(meals).map(([mealType, mealData]) => (
        <MealCard
          key={mealType}
          mealType={mealType}
          mealData={mealData}
          onAddDish={(dish) => onAddDish(mealType, dish)}
          onUpdateDish={(dishId, dish) => onUpdateDish(mealType, dishId, dish)}
          onDeleteDish={(dishId) => onDeleteDish(mealType, dishId)}
          onUpdateTime={(time) => onUpdateTime(mealType, time)}
          showAddDish={showAddDish === mealType}
          setShowAddDish={setShowAddDish}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
        />
      ))}
    </div>
  );
}

function DashboardView({ startDate, endDate, setStartDate, setEndDate, validateDateRange, data }) {
  const [dateError, setDateError] = useState('');

  const handleStartDateChange = (newStart) => {
    if (!validateDateRange(newStart, endDate)) {
      setDateError('Maximum 30 days allowed');
      return;
    }
    setDateError('');
    setStartDate(newStart);
  };

  const handleEndDateChange = (newEnd) => {
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
    Object.values(day.meals).forEach(meal => {
      meal.dishes.forEach(dish => dayTotal += dish.calories);
    });
    return sum + dayTotal;
  }, 0);
  const avgCalories = Math.round(totalCalories / data.length);

  // Calculate meal averages
  const mealAverages = {
    meal1: 0,
    meal2: 0,
    meal3: 0,
    meal4: 0
  };
  
  data.forEach(day => {
    Object.entries(day.meals).forEach(([mealType, meal]) => {
      const mealCal = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
      mealAverages[mealType] += mealCal;
    });
  });
  
  Object.keys(mealAverages).forEach(meal => {
    mealAverages[meal] = Math.round(mealAverages[meal] / data.length);
  });

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
            const icons = { meal1: '🥣', meal2: '🍽️', meal3: '🥗', meal4: '🌮' };
            const labels = { meal1: 'Meal 1', meal2: 'Meal 2', meal3: 'Meal 3', meal4: 'Meal 4' };
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
        {data.map((day, idx) => {
          const date = new Date(day.date);
          const dateLabel = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
          
          const dayTotal = Object.values(day.meals).reduce((sum, meal) => {
            return sum + meal.dishes.reduce((mealSum, dish) => mealSum + dish.calories, 0);
          }, 0);
          
          return (
            <DayCard 
              key={idx} 
              date={dateLabel} 
              meals={day.meals} 
              totalCalories={dayTotal}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCard({ date, meals, totalCalories }) {
  const [expanded, setExpanded] = useState(false);
  const mealIcons = { meal1: '🥣', meal2: '🍽️', meal3: '🥗', meal4: '🌮' };
  const mealNames = { meal1: 'Meal 1', meal2: 'Meal 2', meal3: 'Meal 3', meal4: 'Meal 4' };

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
          {Object.entries(meals).map(([mealType, meal]) => {
            const mealCalories = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
            
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
                  {meal.dishes.map((dish, idx) => (
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

function DishDatabaseView({ dishes, onAddDish, onUpdateDish, onDeleteDish }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dish Database</h2>
            <p className="text-sm text-gray-500">{dishes.length} dishes saved</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-teal-600 transition"
            >
              <Plus size={18} />
              Add Dish
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <DishDBForm
          onSave={(dish) => {
            onAddDish(dish);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Dish List */}
      <div className="space-y-2">
        {dishes.map(dish => (
          <DishDBItem
            key={dish.id}
            dish={dish}
            isEditing={editingDishId === dish.id}
            onEdit={() => setEditingDishId(dish.id)}
            onSave={(updatedDish) => {
              onUpdateDish(dish.id, updatedDish);
              setEditingDishId(null);
            }}
            onDelete={() => onDeleteDish(dish.id)}
            onCancel={() => setEditingDishId(null)}
          />
        ))}
      </div>

      {dishes.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No dishes yet</p>
          <p className="text-sm">Add your first dish to get started</p>
        </div>
      )}
    </div>
  );
}

function DishDBItem({ dish, isEditing, onEdit, onSave, onDelete, onCancel }) {
  const [editData, setEditData] = useState(dish);

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Dish Name *</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Enter dish name"
              className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg text-lg focus:outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Calories per 100g (optional)</label>
            <input
              type="number"
              value={editData.caloriesPer100g || ''}
              onChange={(e) => setEditData({ ...editData, caloriesPer100g: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="e.g., 120"
              className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg text-lg focus:outline-none focus:border-teal-400"
              inputMode="decimal"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editData.name && onSave(editData)}
              disabled={!editData.name}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 disabled:bg-gray-300"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{dish.name}</h3>
          {dish.caloriesPer100g && (
            <p className="text-sm text-teal-600 font-semibold">{dish.caloriesPer100g} cal / 100g</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
            <Edit2 size={18} />
          </button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DishDBForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ name: '', caloriesPer100g: '' });

  const handleSave = () => {
    if (formData.name) {
      onSave({
        name: formData.name,
        caloriesPer100g: formData.caloriesPer100g ? parseFloat(formData.caloriesPer100g) : null
      });
      setFormData({ name: '', caloriesPer100g: '' });
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h3 className="font-bold text-gray-800 mb-3">Add New Dish</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Dish Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter dish name"
            className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg text-lg focus:outline-none focus:border-teal-400"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Calories per 100g (optional)</label>
          <input
            type="number"
            value={formData.caloriesPer100g}
            onChange={(e) => setFormData({ ...formData, caloriesPer100g: e.target.value })}
            placeholder="e.g., 120"
            className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg text-lg focus:outline-none focus:border-teal-400"
            inputMode="decimal"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!formData.name}
            className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 disabled:bg-gray-300"
          >
            <Check size={18} />
            Add
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function MealCard({ mealType, mealData, onAddDish, onUpdateDish, onDeleteDish, onUpdateTime, showAddDish, setShowAddDish, editingDish, setEditingDish }) {
  const mealNames = {
    meal1: '🥣 Meal 1',
    meal2: '🍽️ Meal 2',
    meal3: '🥗 Meal 3',
    meal4: '🌮 Meal 4'
  };

  const totalConsumed = mealData.dishes.reduce((sum, dish) => sum + (dish.before - dish.after), 0);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Meal Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{mealNames[mealType]}</h2>
        <input
          type="time"
          value={mealData.time}
          onChange={(e) => onUpdateTime(e.target.value)}
          className="px-3 py-1 rounded-lg text-sm font-semibold bg-white text-teal-600 border-0"
        />
      </div>

      {/* Dishes */}
      <div className="p-4 space-y-3">
        {mealData.dishes.map(dish => (
          <DishItem
            key={dish.id}
            dish={dish}
            isEditing={editingDish === dish.id}
            onEdit={() => setEditingDish(dish.id)}
            onSave={(updatedDish) => onUpdateDish(dish.id, updatedDish)}
            onDelete={() => onDeleteDish(dish.id)}
            onCancel={() => setEditingDish(null)}
          />
        ))}

        {/* Add Dish Form */}
        {showAddDish ? (
          <DishForm
            onSave={onAddDish}
            onCancel={() => setShowAddDish(null)}
          />
        ) : (
          <button
            onClick={() => setShowAddDish(mealType)}
            className="w-full py-3 border-2 border-dashed border-teal-300 rounded-xl text-teal-600 font-semibold flex items-center justify-center gap-2 hover:bg-teal-50 active:bg-teal-100 transition"
          >
            <Plus size={20} />
            Add Dish
          </button>
        )}

        {/* Total */}
        {mealData.dishes.length > 0 && (
          <div className="pt-3 border-t-2 border-teal-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Total Consumed:</span>
              <span className="text-2xl font-bold text-teal-600">{totalConsumed}g</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DishItem({ dish, isEditing, onEdit, onSave, onDelete, onCancel }) {
  const [editData, setEditData] = useState(dish);

  if (isEditing) {
    return (
      <div className="bg-teal-50 p-3 rounded-xl space-y-2">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          placeholder="Dish name"
          className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={editData.before}
            onChange={(e) => setEditData({ ...editData, before: parseFloat(e.target.value) || 0 })}
            placeholder="Before (g)"
            className="flex-1 px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
          />
          <input
            type="number"
            value={editData.after}
            onChange={(e) => setEditData({ ...editData, after: parseFloat(e.target.value) || 0 })}
            placeholder="After (g)"
            className="flex-1 px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(editData)}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
          >
            <Check size={18} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const consumed = dish.before - dish.after;

  return (
    <div className="bg-gray-50 p-3 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800 text-lg">{dish.name}</h3>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
            <Edit2 size={18} />
          </button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Before: <strong>{dish.before}g</strong></span>
        <span className="text-gray-600">After: <strong>{dish.after}g</strong></span>
        <span className="text-teal-600 font-bold">Ate: {consumed}g</span>
      </div>
    </div>
  );
}

function DishForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ name: '', before: '', after: '' });

  const handleSave = () => {
    if (formData.name && formData.before && formData.after) {
      onSave({
        name: formData.name,
        before: parseFloat(formData.before),
        after: parseFloat(formData.after)
      });
      setFormData({ name: '', before: '', after: '' });
    }
  };

  return (
    <div className="bg-teal-50 p-3 rounded-xl space-y-2">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Dish name (e.g., Rice porridge)"
        className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
        autoFocus
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={formData.before}
          onChange={(e) => setFormData({ ...formData, before: e.target.value })}
          placeholder="Before (g)"
          className="flex-1 px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
          inputMode="decimal"
        />
        <input
          type="number"
          value={formData.after}
          onChange={(e) => setFormData({ ...formData, after: e.target.value })}
          placeholder="After (g)"
          className="flex-1 px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
          inputMode="decimal"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
        >
          <Check size={18} />
          Add
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </div>
  );
}
