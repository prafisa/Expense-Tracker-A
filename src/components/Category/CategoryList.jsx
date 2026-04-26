import React from 'react';
import { Search } from 'lucide-react';
import CategoryListItem from './CategoryListItem';

const CategoryList = ({ expenseCategories, incomeCategories, onEdit, onDelete }) => {
  // Ensure we're working with arrays
  const expenses = Array.isArray(expenseCategories) ? expenseCategories : [];
  const incomes = Array.isArray(incomeCategories) ? incomeCategories : [];
  
  const hasExpenseCategories = expenses.length > 0;
  const hasIncomeCategories = incomes.length > 0;
  
  if (!hasExpenseCategories && !hasIncomeCategories) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
          <Search size={24} className="text-zinc-400" />
        </div>
        <p className="text-zinc-500">No categories found</p>
        <p className="text-sm text-zinc-400 mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Expense Categories */}
      {hasExpenseCategories && (
        <div>
          <h2 className="text-sm font-medium text-zinc-500 mb-2 px-1">
            Expense Categories ({expenses.length})
          </h2>
          {expenses.map(category => (
            <CategoryListItem 
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      
      {/* Income Categories */}
      {hasIncomeCategories && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-zinc-500 mb-2 px-1">
            Income Categories ({incomes.length})
          </h2>
          {incomes.map(category => (
            <CategoryListItem 
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;