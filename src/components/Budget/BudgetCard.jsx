import React from 'react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay: 'code',
    }).format(amount).replace('NPR', 'Rs.');
  };

  const handleEditClick = () => {
    console.log('Edit clicked for budget:', budget);
    onEdit();
  };

  const handleDeleteClick = () => {
    console.log('Delete clicked for budget:', budget);
    onDelete();
  };

  return (
    <div className="px-6 py-5 hover:bg-slate-50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-medium text-slate-900">
              {budget.categoryName}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
              Monthly
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Allocated</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {formatCurrency(budget.allocated)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Period</p>
              <p className="text-sm text-slate-700 mt-1">
                {new Date(budget.month + '-01').toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-2 text-slate-400 hover:text-violet-600 rounded-md transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;