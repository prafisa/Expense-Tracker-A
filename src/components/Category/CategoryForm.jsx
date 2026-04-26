// src/components/Category/CategoryForm.jsx
import React from 'react';

const incomeIcons = [
  { value: 'Briefcase', label: '💼 Salary / Business' },
  { value: 'Gift', label: '🎁 Gift / Bonus' },
  { value: 'TrendingUp', label: '📈 Investment' },
  { value: 'PiggyBank', label: '🐷 Savings' },
  { value: 'Sparkles', label: '✨ Freelance' },
  { value: 'GraduationCap', label: '🎓 Scholarship' }
];

const expenseIcons = [
  { value: 'ShoppingBag', label: '🛍️ Shopping' },
  { value: 'ShoppingCart', label: '🛒 Groceries' },
  { value: 'Utensils', label: '🍽️ Dining' },
  { value: 'Coffee', label: '☕ Coffee' },
  { value: 'Home', label: '🏠 Housing' },
  { value: 'Zap', label: '⚡ Electricity' },
  { value: 'Droplet', label: '💧 Water' },
  { value: 'Wifi', label: '📡 Internet' },
  { value: 'Car', label: '🚗 Transport' },
  { value: 'Bus', label: '🚌 Public Transport' },
  { value: 'Plane', label: '✈️ Travel' },
  { value: 'Film', label: '🎬 Entertainment' },
  { value: 'Tv', label: '📺 Streaming' },
  { value: 'Gamepad2', label: '🎮 Gaming' },
  { value: 'Music', label: '🎵 Music' },
  { value: 'Heart', label: '❤️ Health' },
  { value: 'Dumbbell', label: '💪 Fitness' },
  { value: 'Book', label: '📚 Education' },
  { value: 'Shirt', label: '👕 Clothing' },
  { value: 'Scissors', label: '✂️ Salon' },
  { value: 'Phone', label: '📱 Mobile' },
  { value: 'Stethoscope', label: '🏥 Medical' },
  { value: 'Dog', label: '🐕 Pet' },
  { value: 'Beer', label: '🍺 Bars' },
  { value: 'Cake', label: '🎂 Celebrations' }
];

const CategoryForm = ({ formData, onChange, onSubmit, onCancel, isEditing }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="p-5">
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => onChange({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
        <select
          value={formData.icon}
          onChange={(e) => onChange({ ...formData, icon: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <optgroup label="Income Icons">
            {incomeIcons.map(icon => (
              <option key={icon.value} value={icon.value}>{icon.label}</option>
            ))}
          </optgroup>
          <optgroup label="Expense Icons">
            {expenseIcons.map(icon => (
              <option key={icon.value} value={icon.value}>{icon.label}</option>
            ))}
          </optgroup>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => onChange({ ...formData, color: e.target.value })}
            className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => onChange({ ...formData, color: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono text-sm"
            placeholder="#64748b"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Budget (optional)</label>
        <input
          type="number"
          value={formData.budget || ''}
          onChange={(e) => onChange({ ...formData, budget: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          placeholder="Enter budget amount"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
        />
      </div>
      
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;