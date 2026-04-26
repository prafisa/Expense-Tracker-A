// src/components/Budget/BudgetProgressBar.jsx
import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const BudgetProgressBar = ({ budget, spent, categoryName }) => {
  const progress = (spent / budget) * 100;
  const isOverBudget = spent > budget;
  const remaining = budget - spent;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">Spent</span>
        <span className={`font-medium ${isOverBudget ? 'text-rose-600' : 'text-slate-700'}`}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {isOverBudget && (
        <p className="text-xs text-rose-600 mt-1">
          Over budget by {formatCurrency(Math.abs(remaining))}
        </p>
      )}
    </div>
  );
};

export default BudgetProgressBar;