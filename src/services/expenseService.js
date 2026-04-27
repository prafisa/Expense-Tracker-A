const API_BASE = 'https://localhost:7204/api'

export const expenseService = {
  getAllExpenses: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.categoryId) params.append('categoryId', filters.categoryId)
    if (filters.from)       params.append('from', filters.from)
    if (filters.to)         params.append('to', filters.to)

    const response = await fetch(`${API_BASE}/Expense?${params}`)
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  createExpense: async (data) => {
    const response = await fetch(`${API_BASE}/Expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const text = await response.text()
    if (!response.ok) throw new Error(text || 'Failed to create expense')
    return JSON.parse(text)
  },

  deleteExpense: async (id) => {
    const response = await fetch(`${API_BASE}/Expense/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete expense')
    return true
  }
}