export const categoryFilterService = {
  // Filter categories based on search term and type
  filterCategories: (categories, searchTerm, filterType) => {
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    
    return categories.filter(category => {
      // Search filter
      const matchesSearch = !searchTerm || 
        (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;
      
      // Type filter - handle numeric types
      if (filterType !== 'all') {
        const categoryType = category.type; // 0 = INCOME, 1 = EXPENSE
        const selectedType = filterType.toUpperCase();
        
        // Convert numeric type to string
        let categoryTypeString = '';
        if (categoryType === 0) {
          categoryTypeString = 'INCOME';
        } else if (categoryType === 1) {
          categoryTypeString = 'EXPENSE';
        } else {
          categoryTypeString = String(categoryType).toUpperCase();
        }
        
        if (categoryTypeString !== selectedType) return false;
      }
      
      return true;
    });
  },

  // Calculate statistics
  calculateStats: (categories) => {
    if (!categories || !Array.isArray(categories)) {
      return { total: 0, incomeCount: 0, expenseCount: 0 };
    }
    
    const incomeCount = categories.filter(c => c.type === 0).length;
    const expenseCount = categories.filter(c => c.type === 1).length;
    
    return {
      total: categories.length,
      incomeCount: incomeCount,
      expenseCount: expenseCount
    };
  },

  // Separate income and expense categories
  separateByType: (categories) => {
    if (!categories || !Array.isArray(categories)) {
      return { income: [], expense: [] };
    }
    
    return {
      income: categories.filter(c => c.type === 0),
      expense: categories.filter(c => c.type === 1)
    };
  }
};