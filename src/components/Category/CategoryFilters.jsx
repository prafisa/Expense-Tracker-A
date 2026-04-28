
import React from 'react';
import { Search, Plus } from 'lucide-react';

const CategoryFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterType, 
  onFilterTypeChange, 
  onAddCategory 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          className="px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <button
          onClick={onAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add category
        </button>
      </div>
    </div>
  );
};

export default CategoryFilters;