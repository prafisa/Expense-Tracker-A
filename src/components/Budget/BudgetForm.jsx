import React, { useState, useEffect } from 'react';

const BudgetForm = ({ onSubmit, initialData, selectedMonth, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    allocated: '',
    month: selectedMonth,
    categoryId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      console.log('Initial data for edit:', initialData);
      setFormData({
        allocated: initialData.allocated.toString(),
        month: initialData.month,
        categoryId: initialData.categoryId.toString(),
      });
    } else {
      setFormData({
        allocated: '',
        month: selectedMonth,
        categoryId: '',
      });
    }
  }, [initialData, selectedMonth]);

  const validate = () => {
    const newErrors = {};
    if (!formData.allocated || parseFloat(formData.allocated) <= 0) {
      newErrors.allocated = 'Amount must be greater than 0';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    if (!formData.month) {
      newErrors.month = 'Month is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        allocated: parseFloat(formData.allocated),
        month: formData.month,
        categoryId: parseInt(formData.categoryId),
      };
      console.log('Submitting data:', submitData);
      onSubmit(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Group categories by type
  const incomeCategories = categories.filter(c => c.type === 0 || c.type === '0' || c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 1 || c.type === '1' || c.type === 'EXPENSE');

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-slate-900 mb-5">
        {initialData ? 'Edit Budget' : 'New Budget'}
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Category *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 ${
              errors.categoryId ? 'border-rose-300' : 'border-slate-200'
            }`}
          >
            <option value="">Select a category</option>
            {expenseCategories.length > 0 && (
              <optgroup label="Expense Categories">
                {expenseCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            )}
            {incomeCategories.length > 0 && (
              <optgroup label="Income Categories">
                {incomeCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-rose-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Allocated Amount (Rs.) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400">Rs.</span>
            <input
              type="number"
              name="allocated"
              value={formData.allocated}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={`w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 ${
                errors.allocated ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.allocated && (
            <p className="mt-1 text-xs text-rose-600">{errors.allocated}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Month *
          </label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          />
          {errors.month && (
            <p className="mt-1 text-xs text-rose-600">{errors.month}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors"
        >
          {initialData ? 'Update Budget' : 'Create Budget'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;