// src/components/Budget/BudgetSummaryCard.jsx
import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const BudgetSummaryCard = ({ summary }) => {
  if (!summary || summary.totalBudget === 0) return null;

  const formatPeriod = (month) => {
    if (month === 'All') return 'All Time';
    return new Date(month + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="mb-6">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="grid grid-cols-3 gap-6">
          <div className='text-center'>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Budget</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {formatCurrency(summary.totalBudget)}
            </p>
          </div>
          <div className='text-center'>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Categories</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {summary.categoryCount}
            </p>
          </div>
          <div className='text-center'>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Period</p>
            <p className="text-base font-medium text-slate-700 mt-1">
              {formatPeriod(summary.month)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryCard;