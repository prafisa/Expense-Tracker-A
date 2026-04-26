// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CategoryStats from '../components/Category/CategoryStats';
import CategoryFilters from '../components/Category/CategoryFilters';
import CategoryErrorAlert from '../components/Category/CategoryErrorAlert';
import CategoryList from '../components/Category/CategoryList';
import CategoryModal from '../components/Category/CategoryModal';
import { categoryService } from '../services/categoryService';
import { categoryFilterService } from '../services/categoryFilterService';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({ total: 0, incomeCount: 0, expenseCount: 0 });
  const [filteredCategories, setFilteredCategories] = useState({ income: [], expense: [] });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      try {
        const filtered = categoryFilterService.filterCategories(categories, searchTerm, filterType);
        const separated = categoryFilterService.separateByType(filtered);
        setFilteredCategories(separated);
        
        const newStats = categoryFilterService.calculateStats(categories);
        setStats(newStats);
      } catch (err) {
        console.error('Error filtering categories:', err);
      }
    }
  }, [categories, searchTerm, filterType]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      console.log('Loaded categories:', data);
      console.log('Number of categories:', data?.length);
      
      // Log first category details
      if (data && data.length > 0) {
        console.log('Sample category:', {
          id: data[0].id,
          name: data[0].name,
          type: data[0].type,
          typeValue: data[0].type,
          icon: data[0].icon,
          color: data[0].color
        });
      }
      
      if (data && Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (formData) => {
    try {
      console.log('Creating category:', formData);
      await categoryService.createCategory(formData);
      await loadCategories();
      closeModal();
    } catch (err) {
      console.error('Create error:', err);
      setError(err.message);
    }
  };
const handleUpdateCategory = async (formData) => {
  try {
    console.log('=== HANDLE UPDATE CATEGORY ===');
    console.log('Editing category ID:', editingCategory?.id);
    console.log('Form data received:', formData);
    
    // Make sure we have all required fields
    if (!formData.name) {
      throw new Error('Category name is required');
    }
    
    // Call the update service
    await categoryService.updateCategory(editingCategory.id, formData);
    
    // Reload categories to see the changes
    await loadCategories();
    
    // Close the modal
    closeModal();
    
    // Show success message (optional)
    setError(null);
  } catch (err) {
    console.error('Update error:', err);
    setError(err.message || 'Failed to update category');
  }
};
// Add this to CategoryPage.jsx temporarily for testing
const testUpdateAPI = async () => {
  const testData = {
    name: "Test Category",
    type: 1, // 0 for INCOME, 1 for EXPENSE
    description: "Test description",
    icon: "Tag",
    color: "#64748b"
  };
  
  console.log('Testing API with:', testData);
  
  const response = await fetch('https://localhost:7204/api/Category/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });
  
  const result = await response.text();
  console.log('Test API result:', response.status, result);
};

// Call this from a button or useEffect to test

const handleDeleteCategory = async (id) => {
  if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
  
  try {
    await categoryService.deleteCategory(id);
    await loadCategories();
    setError(null);
  } catch (err) {
    console.error('Delete error:', err);
    if (err.message.includes('in use') || err.message.includes('transactions')) {
      setError('Cannot delete category that is currently in use. Please remove all transactions linked to this category first.');
    } else {
      setError(err.message || 'Failed to delete category');
    }
  }
};

  const openCreateModal = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingCategory) {
      handleUpdateCategory(formData);
    } else {
      handleCreateCategory(formData);
    }
  };

  return (
    <div className=" mx-auto px-1 py-1">
      <CategoryStats stats={stats} />
      
      <CategoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        onAddCategory={openCreateModal}
      />
      
      <CategoryErrorAlert error={error} onClose={() => setError(null)} />
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-violet-500" />
        </div>
      ) : (
        <CategoryList
          expenseCategories={filteredCategories.expense}
          incomeCategories={filteredCategories.income}
          onEdit={openEditModal}
          onDelete={handleDeleteCategory}
        />
      )}
      
      <CategoryModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={editingCategory}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      />
    </div>
  );
};

export default CategoryPage;