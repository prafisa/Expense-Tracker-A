const API_BASE = 'https://localhost:7204/api'

export const budgetService = {
  getAllBudgets: async () => {
    const response = await fetch(`${API_BASE}/budget`)
    if (!response.ok) throw new Error('Failed to load budgets')
    return response.json()
  },

  getBudgetSummary: async (month) => {
    const response = await fetch(`${API_BASE}/budget/summary/${month}`)
    if (!response.ok) throw new Error('Failed to load budget summary')
    return response.json()
  },

  getAvailableDates: async () => {
    const response = await fetch(`${API_BASE}/budget/available-dates`)
    if (!response.ok) throw new Error('Failed to load available dates')
    return response.json()
  },

  getAllCategories: async () => {
    const response = await fetch(`${API_BASE}/category`)
    if (!response.ok) throw new Error('Failed to load categories')
    return response.json()
  },

  createBudget: async (budgetData) => {
    const response = await fetch(`${API_BASE}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to create budget')
    }
    return response.json()
  },

  updateBudget: async (id, budgetData) => {
    const response = await fetch(`${API_BASE}/budget/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to update budget')
    }
    return response.json()
  },

  deleteBudget: async (id) => {
    const response = await fetch(`${API_BASE}/budget/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete budget')
    return true
  },
}