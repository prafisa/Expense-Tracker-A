const API_BASE = 'https://localhost:7204/api'

export const incomeService = {
  getAllIncomes: async () => {
    const response = await fetch(`${API_BASE}/income`)
    if (!response.ok) throw new Error('Failed to fetch incomes')
    return response.json()
  },

  createIncome: async (data) => {
    const response = await fetch(`${API_BASE}/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const text = await response.text()
    if (!response.ok) throw new Error(text || 'Failed to create income')
    return JSON.parse(text)
  },

  deleteIncome: async (id) => {
    const response = await fetch(`${API_BASE}/income/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete income')
    return true
  },
}