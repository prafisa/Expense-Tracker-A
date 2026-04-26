// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Tag, Target, ArrowUpRight, ArrowDownRight, AlertCircle, Loader2, Plus } from 'lucide-react';
import StatsCard from '../components/Common/StatsCard';
import SearchBar from '../components/Common/SearchBar';
import FilterSelect from '../components/Common/FilterSelect';
import Modal from '../components/Common/Modal';
import CategoryCard from '../components/Category/CategoryCard';
import CategoryForm from '../components/Category/CategoryForm';

const API_BASE = 'https://localhost:7204/api';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE',
    description: '',
    icon: 'Tag',
    color: '#64748b',
    budget: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCategories(), fetchBudgets()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const response = await fetch(`${API_BASE}/Category`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    setCategories(data);
  };

  const fetchBudgets = async () => {
    const response = await fetch(`${API_BASE}/budget`);
    if (!response.ok) throw new Error('Failed to fetch budgets');
    const data = await response.json();
    setBudgets(data);
  };

  // Helper function to get spent amount for a category
  const getSpentAmountForCategory = (categoryId, month = null) => {
    const categoryBudgets = budgets.filter(b => b.categoryId === categoryId);
    if (month) {
      return categoryBudgets.filter(b => b.month === month).reduce((sum, b) => sum + b.allocated, 0);
    }
    return categoryBudgets.reduce((sum, b) => sum + b.allocated, 0);
  };

  // Helper function to get transaction count (mock for now)
  const getTransactionCount = (categoryId) => {
    // In real app, this would come from transactions API
    return Math.floor(Math.random() * 30) + 1;
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${API_BASE}/Category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create category');
      
      // If budget is set, create a budget entry
      if (formData.budget && formData.budget > 0) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const newCategory = await response.json();
        
        await fetch(`${API_BASE}/budget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            allocated: formData.budget,
            month: currentMonth,
            categoryId: newCategory.id
          })
        });
      }
      
      await fetchData();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE}/Category/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to update category');
      
      // Update associated budget if changed
      if (formData.budget !== editingCategory.budget) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const existingBudget = budgets.find(b => 
          b.categoryId === editingCategory.id && b.month === currentMonth
        );
        
        if (existingBudget) {
          await fetch(`${API_BASE}/budget/${existingBudget.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              allocated: formData.budget || 0,
              month: currentMonth,
              categoryId: editingCategory.id
            })
          });
        } else if (formData.budget && formData.budget > 0) {
          await fetch(`${API_BASE}/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              allocated: formData.budget,
              month: currentMonth,
              categoryId: editingCategory.id
            })
          });
        }
      }
      
      await fetchData();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`${API_BASE}/Category/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getIconComponent = (iconName, color) => {
    const iconProps = { size: 20, color, strokeWidth: 1.5 };
    const icons = {
      Briefcase: '💼', Gift: '🎁', TrendingUp: '📈', PiggyBank: '🐷',
      Sparkles: '✨', GraduationCap: '🎓', ShoppingBag: '🛍️', ShoppingCart: '🛒',
      Utensils: '🍽️', Coffee: '☕', Home: '🏠', Zap: '⚡', Droplet: '💧',
      Wifi: '📡', Car: '🚗', Bus: '🚌', Plane: '✈️', Film: '🎬', Tv: '📺',
      Gamepad2: '🎮', Music: '🎵', Heart: '❤️', Dumbbell: '💪', Book: '📚',
      Shirt: '👕', Scissors: '✂️', Phone: '📱', Stethoscope: '🏥', Dog: '🐕',
      Beer: '🍺', Cake: '🎂', Tag: '🏷️'
    };
    return <span style={{ color }}>{icons[iconName] || '🏷️'}</span>;
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType !== 'all' && category.type !== filterType.toUpperCase()) return false;
    if (filterBudget === 'hasBudget' && !category.budget) return false;
    if (filterBudget === 'noBudget' && category.budget) return false;
    return matchesSearch;
  });

  const incomeCategories = filteredCategories.filter(c => c.type === 'INCOME');
  const expenseCategories = filteredCategories.filter(c => c.type === 'EXPENSE');
  
  const totalCategories = categories.length;
  const incomeCount = categories.filter(c => c.type === 'INCOME').length;
  const expenseCount = categories.filter(c => c.type === 'EXPENSE').length;
  const hasBudgetCount = categories.filter(c => c.budget).length;

  const typeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ];

  const budgetOptions = [
    { value: 'hasBudget', label: 'Has budget' },
    { value: 'noBudget', label: 'No budget' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Categories</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total" value={totalCategories} icon={Tag} iconColor="violet" footer="Categories" />
          <StatsCard title="Income" value={incomeCount} icon={ArrowUpRight} iconColor="emerald" footer="Categories" />
          <StatsCard title="Expense" value={expenseCount} icon={ArrowDownRight} iconColor="rose" footer="Categories" />
          <StatsCard title="Has Budget" value={hasBudgetCount} icon={Target} iconColor="blue" footer="With budget set" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search categories..."
        />
        
        <div className="flex gap-2">
          <FilterSelect
            value={filterType}
            onChange={setFilterType}
            options={typeOptions}
            placeholder="All types"
          />
          
          <FilterSelect
            value={filterBudget}
            onChange={setFilterBudget}
            options={budgetOptions}
            placeholder="All budgets"
          />
          
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({
                name: '',
                type: 'EXPENSE',
                description: '',
                icon: 'Tag',
                color: '#64748b',
                budget: null
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add category
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md flex items-center gap-2 text-rose-700 text-sm">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <span className="text-rose-500">×</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Expense Categories */}
          {expenseCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={(cat) => {
                setEditingCategory(cat);
                setFormData({
                  name: cat.name,
                  type: cat.type,
                  description: cat.description || '',
                  icon: cat.icon || 'Tag',
                  color: cat.color || '#64748b',
                  budget: cat.budget || null
                });
                setShowModal(true);
              }}
              onDelete={handleDelete}
              spentAmount={getSpentAmountForCategory(category.id)}
              transactionCount={getTransactionCount(category.id)}
              getIcon={getIconComponent}
            />
          ))}
          
          {/* Income Categories */}
          {incomeCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={(cat) => {
                setEditingCategory(cat);
                setFormData({
                  name: cat.name,
                  type: cat.type,
                  description: cat.description || '',
                  icon: cat.icon || 'Tag',
                  color: cat.color || '#64748b',
                  budget: cat.budget || null
                });
                setShowModal(true);
              }}
              onDelete={handleDelete}
              spentAmount={getSpentAmountForCategory(category.id)}
              transactionCount={getTransactionCount(category.id)}
              getIcon={getIconComponent}
            />
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Tag size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500">No categories found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <CategoryForm
          formData={formData}
          onChange={setFormData}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          isEditing={!!editingCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoryPage;