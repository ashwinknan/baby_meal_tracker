import React from 'react';
import { Plus } from 'lucide-react';
import { DishItem } from './DishItem';
import { DishForm } from './DishForm';

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

interface DishDBItem {
  id?: string;
  name: string;
  caloriesPer100g: number | null;
}

interface MealCardProps {
  mealType: string;
  mealData: Meal;
  onAddDish: (dish: Omit<Dish, 'id'>) => void;
  onUpdateDish: (dishId: number, dish: Partial<Dish>) => void;
  onDeleteDish: (dishId: number) => void;
  onUpdateTime: (time: string) => void;
  showAddDish: boolean;
  setShowAddDish: (mealType: string | null) => void;
  editingDish: number | null;
  setEditingDish: (dishId: number | null) => void;
  dishDatabase?: DishDBItem[];
}

export function MealCard({ 
  mealType, 
  mealData, 
  onAddDish, 
  onUpdateDish, 
  onDeleteDish, 
  onUpdateTime, 
  showAddDish, 
  setShowAddDish, 
  editingDish, 
  setEditingDish,
  dishDatabase = []
}: MealCardProps) {
  const mealNames: Record<string, string> = {
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
            dishDatabase={dishDatabase}
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
