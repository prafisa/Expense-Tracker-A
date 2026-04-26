import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { incomeIcons, expenseIcons, getCategoryNameFromIcon } from '../../utils/iconMapper';

// Predefined category combinations (name + icon)
const incomeCategories = [
  { name: 'Salary', icon: 'Briefcase' },
  { name: 'Freelance', icon: 'Sparkles' },
  { name: 'Investment', icon: 'TrendingUp' },
  { name: 'Gift', icon: 'Gift' },
  { name: 'Savings', icon: 'PiggyBank' },
  { name: 'Scholarship', icon: 'GraduationCap' },
  { name: 'Bonus', icon: 'Gift' },
  { name: 'Other Income', icon: 'Tag' }
];

const expenseCategories = [
  { name: 'Food & Dining', icon: 'Utensils' },
  { name: 'Groceries', icon: 'ShoppingCart' },
  { name: 'Shopping', icon: 'ShoppingBag' },
  { name: 'Transport', icon: 'Car' },
  { name: 'Public Transport', icon: 'Bus' },
  { name: 'Travel', icon: 'Plane' },
  { name: 'Entertainment', icon: 'Film' },
  { name: 'Gaming', icon: 'Gamepad2' },
  { name: 'Streaming', icon: 'Tv' },
  { name: 'Music', icon: 'Music' },
  { name: 'Health', icon: 'Heart' },
  { name: 'Medical', icon: 'Stethoscope' },
  { name: 'Fitness', icon: 'Dumbbell' },
  { name: 'Housing', icon: 'Home' },
  { name: 'Rent', icon: 'Home' },
  { name: 'Utilities', icon: 'Zap' },
  { name: 'Electricity', icon: 'Zap' },
  { name: 'Water', icon: 'Droplet' },
  { name: 'Internet', icon: 'Wifi' },
  { name: 'Phone', icon: 'Phone' },
  { name: 'Clothing', icon: 'Shirt' },
  { name: 'Education', icon: 'Book' },
  { name: 'Books', icon: 'Book' },
  { name: 'Coffee', icon: 'Coffee' },
  { name: 'Dining', icon: 'Utensils' },
  { name: 'Bars', icon: 'Beer' },
  { name: 'Celebrations', icon: 'Cake' },
  { name: 'Pets', icon: 'Dog' },
  { name: 'Hobbies', icon: 'Paintbrush' },
  { name: 'Salon', icon: 'Scissors' },
  { name: 'Other Expense', icon: 'Tag' }
];

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Tag',
    type: 'EXPENSE',
    description: '',
    color: '#64748b'
  });

  useEffect(() => {
    if (initialData) {
      let typeValue = 'EXPENSE';
      if (initialData.type === 0 || initialData.type === '0') {
        typeValue = 'INCOME';
      } else if (initialData.type === 1 || initialData.type === '1') {
        typeValue = 'EXPENSE';
      }
      
      setFormData({
        name: initialData.name || '',
        icon: initialData.icon || 'Tag',
        type: typeValue,
        description: initialData.description || '',
        color: initialData.color || '#64748b'
      });
    } else {
      setFormData({
        name: '',
        icon: 'Tag',
        type: 'EXPENSE',
        description: '',
        color: '#64748b'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      icon: formData.icon,
      color: formData.color
    };
    
    console.log('📝 Modal submitting:', submitData);
    onSubmit(submitData);
  };

  const handleNameChange = (selectedName, selectedIcon) => {
    setFormData(prev => ({
      ...prev,
      name: selectedName,
      icon: selectedIcon
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type,
      name: '',
      icon: 'Tag'
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAvailableCategories = () => {
    return formData.type === 'INCOME' ? incomeCategories : expenseCategories;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-zinc-100 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Category Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Category Name *
            </label>
            <select
              value={formData.name}
              onChange={(e) => {
                const selected = getAvailableCategories().find(cat => cat.name === e.target.value);
                if (selected) {
                  handleNameChange(selected.name, selected.icon);
                }
              }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            >
              <option value="">Select a category</option>
              {getAvailableCategories().map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Icon (auto-selected from category)
            </label>
            <div className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${formData.color}15` }}
                >
                  <span role="img" aria-label="icon">
                    {formData.icon === 'Briefcase' && '💼'}
                    {formData.icon === 'Gift' && '🎁'}
                    {formData.icon === 'TrendingUp' && '📈'}
                    {formData.icon === 'PiggyBank' && '🐷'}
                    {formData.icon === 'Sparkles' && '✨'}
                    {formData.icon === 'GraduationCap' && '🎓'}
                    {formData.icon === 'ShoppingBag' && '🛍️'}
                    {formData.icon === 'ShoppingCart' && '🛒'}
                    {formData.icon === 'Utensils' && '🍽️'}
                    {formData.icon === 'Coffee' && '☕'}
                    {formData.icon === 'Home' && '🏠'}
                    {formData.icon === 'Car' && '🚗'}
                    {formData.icon === 'Bus' && '🚌'}
                    {formData.icon === 'Plane' && '✈️'}
                    {formData.icon === 'Film' && '🎬'}
                    {formData.icon === 'Gamepad2' && '🎮'}
                    {formData.icon === 'Music' && '🎵'}
                    {formData.icon === 'Heart' && '❤️'}
                    {formData.icon === 'Dumbbell' && '💪'}
                    {formData.icon === 'Book' && '📚'}
                    {formData.icon === 'Shirt' && '👕'}
                    {formData.icon === 'Phone' && '📱'}
                    {formData.icon === 'Dog' && '🐕'}
                    {formData.icon === 'Beer' && '🍺'}
                    {formData.icon === 'Cake' && '🎂'}
                    {formData.icon === 'Tag' && '🏷️'}
                  </span>
                </div>
                <span className="text-sm text-zinc-600">{formData.icon}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-10 h-10 rounded border border-zinc-200 cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono text-sm"
                placeholder="#64748b"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              placeholder="Enter category description..."
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;