import React from 'react';

const BudgetFilters = ({ 
  selectedYear, 
  selectedMonth, 
  selectedCategory,
  availableYears, 
  months, 
  categories,
  onYearChange, 
  onMonthChange,
  onCategoryChange,
  onClearFilters, 
  onAddBudget 
}) => {
  const hasFilters = selectedYear || selectedMonth || selectedCategory;

  // Convert category type to readable format
  const getCategoryTypeLabel = (type) => {
    if (type === 0 || type === '0' || type === 'INCOME') return 'Income';
    if (type === 1 || type === '1' || type === 'EXPENSE') return 'Expense';
    return '';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All Months</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({getCategoryTypeLabel(category.type)})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-3">
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-md hover:bg-slate-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={onAddBudget}
            className="px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetFilters;