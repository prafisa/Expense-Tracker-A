import React from 'react';

const BudgetErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md">
      <div className="flex items-start justify-between">
        <p className="text-sm text-rose-700">{error}</p>
        <button onClick={onClose} className="text-rose-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BudgetErrorAlert;