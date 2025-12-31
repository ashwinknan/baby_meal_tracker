import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface DishFormProps {
  onSave: (dish: { name: string; before: number; after: number }) => void;
  onCancel: () => void;
}

export function DishForm({ onSave, onCancel }: DishFormProps) {
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
