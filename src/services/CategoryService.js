
const API_BASE = 'https://localhost:7204/api';

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE}/Category`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  },

  createCategory: async (categoryData) => {
    const submitData = {
      name: categoryData.name,
      type: categoryData.type === 'INCOME' ? 0 : 1,
      description: categoryData.description || '',
      icon: categoryData.icon,
      color: categoryData.color
    };
    
    console.log('📝 CREATE CATEGORY:', submitData);
    
    const response = await fetch(`${API_BASE}/Category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });
    
    const responseText = await response.text();
    console.log('Response:', response.status, responseText);
    
    if (!response.ok) {
      throw new Error(responseText || 'Failed to create category');
    }
    
    return JSON.parse(responseText);
  },

  updateCategory: async (id, categoryData) => {
    const submitData = {
      name: categoryData.name,
      type: categoryData.type === 'INCOME' ? 0 : 1,
      description: categoryData.description || '',
      icon: categoryData.icon,
      color: categoryData.color
    };
    
    console.log('🔄 UPDATE CATEGORY:', id, submitData);
    
    const response = await fetch(`${API_BASE}/Category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });
    
    const responseText = await response.text();
    console.log('Response:', response.status, responseText);
    
    if (!response.ok) {
      throw new Error(responseText || 'Failed to update category');
    }
    
    return JSON.parse(responseText);
  },

  deleteCategory: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/Category/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('in use')) {
          throw new Error('Cannot delete category that is in use');
        }
        throw new Error(errorText || 'Failed to delete category');
      }
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  },
};