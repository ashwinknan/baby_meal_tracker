import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface Dish {
  id: number;
  name: string;
  before: number;
  after: number;
}

interface DishItemProps {
  dish: Dish;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (dish: Partial<Dish>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function DishItem({ dish, isEditing, onEdit, onSave, onDelete, onCancel }: DishItemProps) {
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
        {/* Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row gap-2">
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
        <span className="text-gray-600">
          Before: <strong>{dish.before > 0 ? `${dish.before}g` : '-'}</strong>
        </span>
        <span className="text-gray-600">
          After: <strong>{dish.after > 0 ? `${dish.after}g` : '-'}</strong>
        </span>
        <span className="text-teal-600 font-bold">
          Ate: {consumed > 0 ? `${consumed}g` : '-'}
        </span>
      </div>
    </div>
  );
}
