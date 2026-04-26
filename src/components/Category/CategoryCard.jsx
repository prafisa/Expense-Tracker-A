// src/components/Category/CategoryCard.jsx
import React from 'react';
import BudgetProgressBar from '../Budget/BudgetProgressBar';
import { formatCurrency } from '../../utils/currencyFormatter';

const CategoryCard = ({ category, onEdit, onDelete, spentAmount = 0, transactionCount = 0, getIcon }) => {
  const isOverBudget = spentAmount > (category.budget || 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            {getIcon(category.icon, category.color)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium text-slate-900">{category.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                category.type === 'INCOME' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-rose-50 text-rose-600'
              }`}>
                {category.type}
              </span>
            </div>
            <p className="text-xs text-slate-400">{transactionCount} transactions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1.5 text-sm text-slate-600 hover:text-violet-500 rounded-md transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="px-3 py-1.5 text-sm text-slate-600 hover:text-rose-500 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Budget Section */}
      {category.budget ? (
        <BudgetProgressBar 
          budget={category.budget} 
          spent={spentAmount}
          categoryName={category.name}
        />
      ) : (
        <div className="mt-3">
          <p className="text-xs text-slate-400">No budget set</p>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;