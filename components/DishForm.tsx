import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface DishDBItem {
  id?: string;
  name: string;
  caloriesPer100g: number | null;
}

interface DishFormProps {
  onSave: (dish: { name: string; before: number; after: number }) => void;
  onCancel: () => void;
  dishDatabase?: DishDBItem[];
}

export function DishForm({ onSave, onCancel, dishDatabase = [] }: DishFormProps) {
  const [formData, setFormData] = useState({ name: '', before: '', after: '' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDishes, setFilteredDishes] = useState<DishDBItem[]>([]);

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    
    if (value.trim() === '') {
      setShowSuggestions(false);
      setFilteredDishes([]);
      return;
    }

    // Filter dishes from database
    const matches = dishDatabase.filter(dish =>
      dish.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredDishes(matches);
    setShowSuggestions(true);
  };

  const selectDish = (dish: DishDBItem) => {
    setFormData({ ...formData, name: dish.name });
    setShowSuggestions(false);
  };

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
      <div className="relative">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => formData.name && setShowSuggestions(true)}
          placeholder="Dish name (e.g., Rice porridge)"
          className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 text-lg"
          autoFocus
        />
        
        {/* Autocomplete Dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-teal-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDish(dish)}
                  className="w-full text-left px-3 py-2 hover:bg-teal-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-semibold text-gray-800">{dish.name}</div>
                  {dish.caloriesPer100g && (
                    <div className="text-xs text-teal-600">{dish.caloriesPer100g} cal/100g</div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 italic">
                No dishes found in database
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row gap-2">
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
