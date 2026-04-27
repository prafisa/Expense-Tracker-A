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

  // Get budget summary
  getBudgetSummary: async (month) => {
    const response = await fetch(`${API_BASE}/budget/summary/${month}`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },
};