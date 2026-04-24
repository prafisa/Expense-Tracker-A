import React from 'react';

const BudgetSummary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(amount).replace('NPR', 'Rs.');
  };

  if (!summary || summary.totalBudget === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-sm opacity-90">Total Budget</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalBudget)}</p>
        </div>
        <div>
          <p className="text-sm opacity-90">Categories</p>
          <p className="text-3xl font-bold">{summary.categoryCount}</p>
        </div>
        <div>
          <p className="text-sm opacity-90">Period</p>
          <p className="text-xl font-semibold">
            {summary.month === 'All' ? 'All Time' : new Date(summary.month + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;