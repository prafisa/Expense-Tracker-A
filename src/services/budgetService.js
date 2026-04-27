const API_BASE = 'https://localhost:7204/api';

export const budgetService = {
  // Get all budgets
  getAllBudgets: async () => {
    const response = await fetch(`${API_BASE}/budget`);
    if (!response.ok) throw new Error('Failed to load budgets');
    return response.json();
  },

  // Get available dates (years with data)
  getAvailableDates: async () => {
    const response = await fetch(`${API_BASE}/budget/available-dates`);
    if (!response.ok) throw new Error('Failed to load available dates');
    return response.json();
  },

  // Get all categories for filtering
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE}/Category`);
    if (!response.ok) throw new Error('Failed to load categories');
    return response.json();
  },

  // Get expenses for a specific category and month range
  getExpensesByCategoryAndMonth: async (categoryId, month) => {
    try {
      // Parse the month (format: YYYY-MM)
      const [year, monthNum] = month.split('-');
      
      // Create date range for the entire month
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-31`;
      
      console.log(`Fetching expenses for category ${categoryId} from ${startDate} to ${endDate}`);
      
      const response = await fetch(`${API_BASE}/Expense?categoryId=${categoryId}&from=${startDate}&to=${endDate}`);
      
      if (!response.ok) {
        console.error('Failed to fetch expenses:', response.status);
        return [];
      }
      
      const expenses = await response.json();
      console.log(`Found ${expenses.length} expenses for category ${categoryId} in ${month}`);
      
      return expenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  // Get all expenses for a month (for summary)
  getExpensesByMonth: async (month) => {
    try {
      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-31`;
      
      const response = await fetch(`${API_BASE}/Expense?from=${startDate}&to=${endDate}`);
      
      if (!response.ok) {
        console.error('Failed to fetch expenses:', response.status);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  // Calculate spent amount for a budget
  calculateSpentAmount: async (categoryId, month) => {
    try {
      const expenses = await budgetService.getExpensesByCategoryAndMonth(categoryId, month);
      
      // Sum all expense amounts (ensure amount is a number)
      const totalSpent = expenses.reduce((sum, expense) => {
        const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      console.log(`Total spent for category ${categoryId} in ${month}: Rs. ${totalSpent}`);
      return totalSpent;
    } catch (error) {
      console.error('Error calculating spent amount:', error);
      return 0;
    }
  },

  // Get all budgets with spent amounts
  getAllBudgetsWithSpent: async () => {
    try {
      const budgets = await budgetService.getAllBudgets();
      console.log(`Found ${budgets.length} budgets`);
      
      const budgetsWithSpent = await Promise.all(
        budgets.map(async (budget) => {
          const spent = await budgetService.calculateSpentAmount(budget.categoryId, budget.month);
          return {
            ...budget,
            spent: spent,
            remaining: budget.allocated - spent,
            percentageUsed: (spent / budget.allocated) * 100
          };
        })
      );
      
      return budgetsWithSpent;
    } catch (error) {
      console.error('Error getting budgets with spent:', error);
      return [];
    }
  },

  // Create new budget
  createBudget: async (budgetData) => {
    const response = await fetch(`${API_BASE}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create budget');
    }
    return response.json();
  },

  // Update existing budget
  updateBudget: async (id, budgetData) => {
    const response = await fetch(`${API_BASE}/budget/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to update budget';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Delete budget
  deleteBudget: async (id) => {
    const response = await fetch(`${API_BASE}/budget/${id}`, { 
      method: 'DELETE' 
    });
    if (!response.ok) throw new Error('Failed to delete budget');
    return true;
  },

  // Delete budgets by month
  deleteBudgetsByMonth: async (month) => {
    const response = await fetch(`${API_BASE}/budget/month/${month}`, { 
      method: 'DELETE' 
    });
    if (!response.ok) throw new Error('Failed to delete budgets');
    return response.json();
  },

  // Get budget summary with actual spent amounts
  getBudgetSummary: async (month) => {
    try {
      const budgets = await budgetService.getAllBudgets();
      const monthlyBudgets = budgets.filter(b => b.month === month);
      
      let totalBudget = 0;
      let totalSpent = 0;
      
      const budgetsWithSpent = await Promise.all(
        monthlyBudgets.map(async (budget) => {
          const spent = await budgetService.calculateSpentAmount(budget.categoryId, month);
          totalBudget += budget.allocated;
          totalSpent += spent;
          return { ...budget, spent };
        })
      );
      
      return {
        month: month,
        totalBudget: totalBudget,
        totalSpent: totalSpent,
        remaining: totalBudget - totalSpent,
        categoryCount: monthlyBudgets.length,
        budgets: budgetsWithSpent
      };
    } catch (error) {
      console.error('Error getting budget summary:', error);
      return null;
    }
  },
};