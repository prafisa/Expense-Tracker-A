export const categoryFilterService = {
  // Filter categories based on search term and type
  filterCategories: (categories, searchTerm, filterType) => {
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    
    return categories.filter(category => {
      // Search filter - check name (case insensitive)
      const matchesSearch = !searchTerm || 
        (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;
      
      // Type filter - handle both string and numeric types
      if (filterType !== 'all') {
        let categoryType = category.type;
        
        // Convert number to string if needed
        if (typeof categoryType === 'number') {
          categoryType = categoryType === 0 ? 'INCOME' : 'EXPENSE';
        }
        
        // Convert to uppercase for comparison
        categoryType = String(categoryType).toUpperCase();
        const selectedType = filterType.toUpperCase();
        
        if (categoryType !== selectedType) return false;
      }
      
      return true;
    });
  },

  // Calculate statistics
  calculateStats: (categories) => {
    if (!categories || !Array.isArray(categories)) {
      return { total: 0, incomeCount: 0, expenseCount: 0 };
    }
    
    let incomeCount = 0;
    let expenseCount = 0;
    
    categories.forEach(category => {
      let categoryType = category.type;
      if (typeof categoryType === 'number') {
        categoryType = categoryType === 0 ? 'INCOME' : 'EXPENSE';
      } else {
        categoryType = String(categoryType).toUpperCase();
      }
      
      if (categoryType === 'INCOME') {
        incomeCount++;
      } else if (categoryType === 'EXPENSE') {
        expenseCount++;
      }
    });
    
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
    
    const income = [];
    const expense = [];
    
    categories.forEach(category => {
      let categoryType = category.type;
      if (typeof categoryType === 'number') {
        categoryType = categoryType === 0 ? 'INCOME' : 'EXPENSE';
      } else {
        categoryType = String(categoryType).toUpperCase();
      }
      
      if (categoryType === 'INCOME') {
        income.push(category);
      } else if (categoryType === 'EXPENSE') {
        expense.push(category);
      }
    });
    
    console.log('Separated - Income:', income.length, 'Expense:', expense.length);
    
    return { income, expense };
  }
};