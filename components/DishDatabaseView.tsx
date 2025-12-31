import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface DishDBItem {
  id?: string;
  name: string;
  caloriesPer100g: number | null;
}

interface DishDatabaseViewProps {
  dishes: DishDBItem[];
  onAddDish: (dish: Omit<DishDBItem, 'id'>) => void;
  onUpdateDish: (dishId: string, dish: Partial<DishDBItem>) => void;
  onDeleteDish: (dishId: string) => void;
}

export function DishDatabaseView({ dishes, onAddDish, onUpdateDish, onDeleteDish }: DishDatabaseViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

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
          <DishDBItemComponent
            key={dish.id}
            dish={dish}
            isEditing={editingDishId === dish.id}
            onEdit={() => setEditingDishId(dish.id!)}
            onSave={(updatedDish) => {
              onUpdateDish(dish.id!, updatedDish);
              setEditingDishId(null);
            }}
            onDelete={() => onDeleteDish(dish.id!)}
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

function DishDBItemComponent({ 
  dish, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete, 
  onCancel 
}: {
  dish: DishDBItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (dish: Partial<DishDBItem>) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
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

function DishDBForm({ 
  onSave, 
  onCancel 
}: {
  onSave: (dish: Omit<DishDBItem, 'id'>) => void;
  onCancel: () => void;
}) {
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
