import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface DayCardProps {
  date: string;
  meals: any;
  totalCalories: number;
  onEditDish?: (date: string, mealType: string, dishIndex: number, dish: any) => void;
  onDeleteDish?: (date: string, mealType: string, dishIndex: number) => void;
}

export function DayCard({ date, meals, totalCalories, onEditDish, onDeleteDish }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingDish, setEditingDish] = useState<{mealType: string, index: number} | null>(null);
  const [editData, setEditData] = useState<any>(null);
  
  const mealIcons: Record<string, string> = { meal1: '🥣', meal2: '🍽️', meal3: '🥗', meal4: '🌮' };
  const mealNames: Record<string, string> = { meal1: 'Meal 1', meal2: 'Meal 2', meal3: 'Meal 3', meal4: 'Meal 4' };

  const handleEdit = (mealType: string, index: number, dish: any) => {
    setEditingDish({ mealType, index });
    setEditData({
      name: dish.name,
      before: dish.before || (dish.grams + dish.after),
      after: dish.after || 0
    });
  };

  const handleSave = (dateStr: string, mealType: string, index: number) => {
    if (onEditDish && editData) {
      onEditDish(dateStr, mealType, index, {
        name: editData.name,
        before: parseFloat(editData.before),
        after: parseFloat(editData.after)
      });
    }
    setEditingDish(null);
    setEditData(null);
  };

  const handleDelete = (dateStr: string, mealType: string, index: number) => {
    if (confirm('Delete this dish?')) {
      onDeleteDish?.(dateStr, mealType, index);
    }
  };

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
                  {meal.dishes.map((dish: any, idx: number) => {
                    const isEditing = editingDish?.mealType === mealType && editingDish?.index === idx;
                    
                    if (isEditing && editData) {
                      return (
                        <div key={idx} className="bg-teal-50 p-3 rounded-xl space-y-2">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-2 py-1 text-sm border-2 border-teal-200 rounded"
                            placeholder="Dish name"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="number"
                              value={editData.before}
                              onChange={(e) => setEditData({ ...editData, before: e.target.value })}
                              className="flex-1 px-2 py-1 text-sm border-2 border-teal-200 rounded"
                              placeholder="Before (g)"
                            />
                            <input
                              type="number"
                              value={editData.after}
                              onChange={(e) => setEditData({ ...editData, after: e.target.value })}
                              className="flex-1 px-2 py-1 text-sm border-2 border-teal-200 rounded"
                              placeholder="After (g)"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(date, mealType, idx)}
                              className="flex-1 bg-green-500 text-white py-1 rounded text-sm font-semibold flex items-center justify-center gap-1"
                            >
                              <Check size={14} />
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingDish(null); setEditData(null); }}
                              className="flex-1 bg-gray-400 text-white py-1 rounded text-sm font-semibold flex items-center justify-center gap-1"
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} className="flex justify-between text-sm bg-teal-50 p-2 rounded items-center">
                        <div className="flex-1">
                          <span className="text-gray-700 font-medium">{dish.name}</span>
                          <div className="text-xs text-gray-500">{dish.grams}g • <strong className="text-teal-600">{dish.calories} cal</strong></div>
                        </div>
                        {(onEditDish || onDeleteDish) && (
                          <div className="flex gap-1 ml-2">
                            {onEditDish && (
                              <button
                                onClick={() => handleEdit(mealType, idx, dish)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            {onDeleteDish && (
                              <button
                                onClick={() => handleDelete(date, mealType, idx)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
