import React from 'react';
import { MealCard } from './MealCard';

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

interface TrackerViewProps {
  meals: Record<string, Meal>;
  onAddDish: (mealType: string, dish: Omit<Dish, 'id'>) => void;
  onUpdateDish: (mealType: string, dishId: number, dish: Partial<Dish>) => void;
  onDeleteDish: (mealType: string, dishId: number) => void;
  onUpdateTime: (mealType: string, time: string) => void;
  onClearMeal: (mealType: string) => void;
  showAddDish: string | null;
  setShowAddDish: (mealType: string | null) => void;
  editingDish: number | null;
  setEditingDish: (dishId: number | null) => void;
  dishDatabase?: DishDBItem[];
}

export function TrackerView({
  meals,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
  onUpdateTime,
  onClearMeal,
  showAddDish,
  setShowAddDish,
  editingDish,
  setEditingDish,
  dishDatabase = []
}: TrackerViewProps) {
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
          onClearMeal={() => onClearMeal(mealType)}
          showAddDish={showAddDish === mealType}
          setShowAddDish={setShowAddDish}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
          dishDatabase={dishDatabase}
        />
      ))}
    </div>
  );
}
