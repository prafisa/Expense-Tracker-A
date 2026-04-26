import React from 'react';
import BudgetList from './BudgetList';

const BudgetListContainer = ({ budgets, onEdit, onDelete, onAddBudget, loading }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
          All Budgets {budgets.length > 0 && `(${budgets.length})`}
        </h2>
      </div>
      <BudgetList
        budgets={budgets}
        onEdit={onEdit}
        onDelete={onDelete}
        onShowForm={onAddBudget}
        loading={loading}
      />
    </div>
  );
};

export default BudgetListContainer;