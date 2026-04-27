import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { incomeIcons, expenseIcons } from '../../utils/iconMapper';

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
      // Determine the type correctly
      let typeValue = 'EXPENSE';
      const originalType = initialData.type;
      
      if (typeof originalType === 'number') {
        typeValue = originalType === 0 ? 'INCOME' : 'EXPENSE';
      } else if (typeof originalType === 'string') {
        typeValue = originalType.toUpperCase();
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
    
    // Only send fields that have changed
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentIconPreview = () => {
    const iconMap = [...incomeIcons, ...expenseIcons];
    const currentIcon = iconMap.find(i => i.value === formData.icon);
    return currentIcon ? currentIcon.label : '🏷️ Other';
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
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Category Icon *
            </label>
            <select
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
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
            <p className="text-xs text-zinc-400 mt-1">
              Selected: {getCurrentIconPreview()}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
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