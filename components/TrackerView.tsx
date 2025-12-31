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

interface TrackerViewProps {
  meals: Record<string, Meal>;
  onAddDish: (mealType: string, dish: Omit<Dish, 'id'>) => void;
  onUpdateDish: (mealType: string, dishId: number, dish: Partial<Dish>) => void;
  onDeleteDish: (mealType: string, dishId: number) => void;
  onUpdateTime: (mealType: string, time: string) => void;
  showAddDish: string | null;
  setShowAddDish: (mealType: string | null) => void;
  editingDish: number | null;
  setEditingDish: (dishId: number | null) => void;
}

export function TrackerView({
  meals,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
  onUpdateTime,
  showAddDish,
  setShowAddDish,
  editingDish,
  setEditingDish,
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
          showAddDish={showAddDish === mealType}
          setShowAddDish={setShowAddDish}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
        />
      ))}
    </div>
  );
}
