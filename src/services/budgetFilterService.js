export const budgetFilterService = {
  // Filter budgets by year and month
  filterBudgets: (budgets, selectedYear, selectedMonth) => {
    let filtered = [...budgets];
    
    if (selectedYear) {
      filtered = filtered.filter(b => b.month.startsWith(selectedYear));
    }
    
    if (selectedMonth) {
      const monthStr = selectedMonth.padStart(2, '0');
      filtered = filtered.filter(b => b.month.endsWith(monthStr));
    }
    
    return filtered;
  },

  // Calculate summary from filtered budgets
  calculateSummary: (filteredBudgets, selectedYear, selectedMonth) => {
    if (selectedYear && selectedMonth) {
      const monthStr = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      const monthlyBudgets = filteredBudgets.filter(b => b.month === monthStr);
      return {
        month: monthStr,
        totalBudget: monthlyBudgets.reduce((sum, b) => sum + b.allocated, 0),
        categoryCount: monthlyBudgets.length
      };
    } else if (filteredBudgets.length > 0) {
      return {
        month: 'All',
        totalBudget: filteredBudgets.reduce((sum, b) => sum + b.allocated, 0),
        categoryCount: filteredBudgets.length
      };
    }
    return null;
  },
};
