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

  // In the useEffect that sets filteredCategories, add:
useEffect(() => {
  if (categories && categories.length > 0) {
    console.log('=== PROCESSING CATEGORIES ===');
    console.log('All categories:', categories);
    
    const filtered = categoryFilterService.filterCategories(categories, searchTerm, filterType);
    console.log('After filter:', filtered);
    
    const separated = categoryFilterService.separateByType(filtered);
    console.log('After separation:', separated);
    
    setFilteredCategories(separated);
    
    const newStats = categoryFilterService.calculateStats(categories);
    setStats(newStats);
  }
}, [categories, searchTerm, filterType]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      console.log('Loaded categories:', data);
      console.log('Number of categories:', data?.length);
      
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

 // In CategoryPage.jsx, update the handleUpdateCategory function
const handleUpdateCategory = async (formData) => {
  try {
    console.log('Updating category:', editingCategory?.id, formData);
    
    // Only send the fields that are being updated
    const updateData = {
      name: formData.name,
      type: formData.type === 'INCOME' ? 0 : 1, // Convert to number for backend
      description: formData.description,
      icon: formData.icon,
      color: formData.color
    };
    
    await categoryService.updateCategory(editingCategory.id, updateData);
    await loadCategories();
    closeModal();
  } catch (err) {
    console.error('Update error:', err);
    setError(err.message);
  }
};

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
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
    <div className="max-w-7xl mx-auto px-4 py-6">
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