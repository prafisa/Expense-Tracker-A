// src/services/budgetService.js
const API_BASE_URL = 'http://localhost:7204/api';

export const budgetService = {
  getAllBudgets: async () => {
    const response = await fetch(`${API_BASE_URL}/budget`);
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return response.json();
  },

  getBudgetsByMonth: async (month) => {
    const response = await fetch(`${API_BASE_URL}/budget/month/${month}`);
    if (!response.ok) throw new Error('Failed to fetch budgets for month');
    return response.json();
  },

  createBudget: async (budgetData) => {
    const response = await fetch(`${API_BASE_URL}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create budget');
    }
    return response.json();
  },

  updateBudget: async (id, budgetData) => {
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update budget');
    }
    return response.json();
  },

  deleteBudget: async (id) => {
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete budget');
    }
    return response;
  },

  deleteBudgetsByMonth: async (month) => {
    const response = await fetch(`${API_BASE_URL}/budget/month/${month}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete budgets');
    }
    return response.json();
  },

  getBudgetSummary: async (month) => {
    const response = await fetch(`${API_BASE_URL}/budget/summary/${month}`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },
};