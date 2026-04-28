export const categoryFilterService = {
  filterCategories: (categories, searchTerm, filterType) => {
    if (!Array.isArray(categories)) return []

    return categories.filter(category => {
      const matchesSearch = !searchTerm ||
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      if (filterType !== 'all') {
        const catType = category.type?.toUpperCase()
        if (catType !== filterType.toUpperCase()) return false
      }

      return true
    })
  },

  calculateStats: (categories) => {
    if (!Array.isArray(categories))
      return { total: 0, incomeCount: 0, expenseCount: 0 }

    return {
      total:        categories.length,
      incomeCount:  categories.filter(c => c.type?.toUpperCase() === 'INCOME').length,
      expenseCount: categories.filter(c => c.type?.toUpperCase() === 'EXPENSE').length,
    }
  },

  separateByType: (categories) => {
    if (!Array.isArray(categories)) return { income: [], expense: [] }

    return {
      income:  categories.filter(c => c.type?.toUpperCase() === 'INCOME'),
      expense: categories.filter(c => c.type?.toUpperCase() === 'EXPENSE'),
    }
  },
}