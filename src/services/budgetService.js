const API_BASE_URL = 'https://localhost:7204/api';

export const budgetService = {
  // Get all budgets
  getAllBudgets: async () => {
    const response = await fetch(`${API_BASE_URL}/budget`);
    if (!response.ok) throw new Error('Failed to load budgets');
    return response.json();
  },

  // Get available dates (years with data)
  getAvailableDates: async () => {
    const response = await fetch(`${API_BASE_URL}/budget/available-dates`);
    if (!response.ok) throw new Error('Failed to load available dates');
    return response.json();
  },

  // Create new budget
  createBudget: async (budgetData) => {
    const response = await fetch(`${API_BASE_URL}/budget`, {
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
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, { 
      method: 'DELETE' 
    });
    if (!response.ok) throw new Error('Failed to delete budget');
    return true;
  },
};