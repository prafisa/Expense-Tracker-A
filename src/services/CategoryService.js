const API_BASE = 'https://localhost:7204/api'

export const categoryService = {
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE}/category`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        categoryData.name,
        type:        categoryData.type,   // already "INCOME" or "EXPENSE" string
        description: categoryData.description || '',
        icon:        categoryData.icon,
        color:       categoryData.color,
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || 'Failed to create category')
    }
    return response.json()
  },

  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_BASE}/category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        categoryData.name,
        type:        categoryData.type,   // already "INCOME" or "EXPENSE" string
        description: categoryData.description || '',
        icon:        categoryData.icon,
        color:       categoryData.color,
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || 'Failed to update category')
    }
    return response.json()
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE}/category/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || 'Failed to delete category')
    }
    return true
  },
}