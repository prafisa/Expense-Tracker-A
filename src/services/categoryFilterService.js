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
      
      // Type filter
      if (filterType !== 'all') {
        let categoryType = category.type;
        
        // Handle different type formats
        if (typeof categoryType === 'number') {
          categoryType = categoryType === 0 ? 'INCOME' : 'EXPENSE';
        } else if (typeof categoryType === 'string') {
          categoryType = categoryType.toUpperCase();
        }
        
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
        if (categoryType === 0) incomeCount++;
        else if (categoryType === 1) expenseCount++;
      } else if (typeof categoryType === 'string') {
        const typeUpper = categoryType.toUpperCase();
        if (typeUpper === 'INCOME') incomeCount++;
        else if (typeUpper === 'EXPENSE') expenseCount++;
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
      
      // Handle different type formats correctly
      if (typeof categoryType === 'number') {
        if (categoryType === 0) {
          income.push(category);
        } else if (categoryType === 1) {
          expense.push(category);
        }
      } else if (typeof categoryType === 'string') {
        const typeUpper = categoryType.toUpperCase();
        if (typeUpper === 'INCOME') {
          income.push(category);
        } else if (typeUpper === 'EXPENSE') {
          expense.push(category);
        }
      }
    });
    
    console.log('Separated - Income:', income.length, 'Expense:', expense.length);
    
    return { income, expense };
  }
};