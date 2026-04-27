import React, { useState, useEffect } from 'react';
import BudgetTableRow from './BudgetTableRow';
import { budgetService } from '../../services/budgetService';

const BudgetList = ({ budgets, onEdit, onDelete, onShowForm, loading }) => {
  const [budgetsWithSpent, setBudgetsWithSpent] = useState([]);
  const [loadingSpent, setLoadingSpent] = useState(false);

  // Recalculate spent amounts whenever budgets change
  useEffect(() => {
    if (budgets && budgets.length > 0) {
      loadSpentAmounts();
    } else {
      setBudgetsWithSpent([]);
    }
  }, [budgets]); // Only depends on budgets

  const loadSpentAmounts = async () => {
    setLoadingSpent(true);
    try {
      console.log('Loading spent amounts for budgets...');
      
      const budgetsWithSpentData = await Promise.all(
        budgets.map(async (budget) => {
          const spent = await budgetService.calculateSpentAmount(budget.categoryId, budget.month);
          console.log(`Budget: ${budget.categoryName}, Month: ${budget.month}, Spent: ${spent}`);
          
          return {
            ...budget,
            spent: spent,
            remaining: budget.allocated - spent,
            percentageUsed: (spent / budget.allocated) * 100
          };
        })
      );
      
      setBudgetsWithSpent(budgetsWithSpentData);
    } catch (error) {
      console.error('Error loading spent amounts:', error);
      setBudgetsWithSpent(budgets);
    } finally {
      setLoadingSpent(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
        <p className="mt-3 text-sm text-slate-500">Loading budgets...</p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-900">No budgets found</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by creating a budget.</p>
        <button
          onClick={onShowForm}
          className="mt-4 px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors"
        >
          Create Budget
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Month
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Budgeted
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Spent
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Remaining
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {loadingSpent ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600"></div>
                <p className="mt-2 text-sm text-slate-500">Calculating spent amounts...</p>
              </td>
            </tr>
          ) : (
            budgetsWithSpent.map((budget) => (
              <BudgetTableRow
                key={budget.id}
                budget={budget}
                onEdit={() => onEdit(budget)}
                onDelete={() => onDelete(budget.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetList;