import React from 'react';

const BudgetTableRow = ({ budget, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(amount).replace('NPR', 'Rs.');
  };

  const spentAmount = budget.spent || 0;
  const remainingAmount = budget.remaining !== undefined ? budget.remaining : budget.allocated - spentAmount;
  const percentageUsed = budget.percentageUsed !== undefined ? budget.percentageUsed : (spentAmount / budget.allocated) * 100;

  const getStatusColor = () => {
    if (percentageUsed >= 100) return 'text-rose-600 bg-rose-50';
    if (percentageUsed >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  const getStatusText = () => {
    if (percentageUsed >= 100) return 'Exceeded';
    if (percentageUsed >= 80) return 'Near Limit';
    return 'On Track';
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-900">
          {budget.categoryName}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-600">
          {formatMonth(budget.month)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-slate-900">
          {formatCurrency(budget.allocated)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-rose-600">
          {formatCurrency(spentAmount)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${remainingAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatCurrency(Math.abs(remainingAmount))}
          {remainingAmount < 0 && ' (Over)'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap ">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="p-1 text-slate-400 hover:text-violet-600 rounded-md transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BudgetTableRow;