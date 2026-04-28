// src/components/Budget/BudgetManager.jsx
import React, { useState, useEffect } from 'react';
import BudgetList from '../components/Budget/BudgetList';
import BudgetModal from '../components/Budget/BudgetModal';
import BudgetSummary from '../components/Budget/BudgetSummary';
import BudgetFilters from '../components/Budget/BudgetFilters';
import { budgetService } from '../services/budgetService';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [months] = useState([
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [summary, setSummary] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency', currency: 'NPR',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(amount).replace('NPR', 'Rs.');
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterBudgets();
  }, [selectedYear, selectedMonth, selectedCategory, budgets]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadAllBudgets(), loadAvailableDates(), loadCategories()]);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBudgets = async () => {
  try {
    const data = await budgetService.getAllBudgets()
    // data already has spent, remaining on each budget from backend
    setBudgets(data)
  } catch (err) {
    setError(err.message)
  }
}

  const loadAvailableDates = async () => {
    try {
      const data = await budgetService.getAvailableDates();
      setAvailableYears(data.years);
      if (data.years.length > 0 && !selectedYear) {
        setSelectedYear(data.years[data.years.length - 1].toString());
      }
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const loadCategories = async () => {
  try {
    const data = await budgetService.getAllCategories()
    // budgets are expense-only, filter here
    setCategories(data.filter(c => c.type?.toUpperCase() === 'EXPENSE'))
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

 const filterBudgets = () => {
  let filtered = [...budgets]

  if (selectedYear)
    filtered = filtered.filter(b => b.month.startsWith(selectedYear))

  if (selectedMonth) {
    const monthStr = selectedMonth.padStart(2, '0')
    filtered = filtered.filter(b => b.month.endsWith(monthStr))
  }

  if (selectedCategory)
    filtered = filtered.filter(b => b.categoryId === parseInt(selectedCategory))

  setFilteredBudgets(filtered)

  if (filtered.length > 0) {
    setSummary({
      month:         selectedYear && selectedMonth
                       ? `${selectedYear}-${selectedMonth.padStart(2, '0')}`
                       : 'All',
      totalBudget:   filtered.reduce((s, b) => s + b.allocated, 0),
      totalSpent:    filtered.reduce((s, b) => s + b.spent, 0),
      totalRemaining: filtered.reduce((s, b) => s + b.remaining, 0),
      categoryCount: filtered.length,
    })
  } else {
    setSummary(null)
  }
}

  const handleCreateBudget = async (budgetData) => {
    setLoading(true);
    setError(null);
    try {
      await budgetService.createBudget(budgetData);
      await loadAllBudgets();
      await loadAvailableDates();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (id, budgetData) => {
    setLoading(true);
    setError(null);
    try {
      await budgetService.updateBudget(id, budgetData);
      await loadAllBudgets();
      await loadAvailableDates();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    setLoading(true);
    try {
      await budgetService.deleteBudget(id);
      await loadAllBudgets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedCategory('');
  };

  const openCreateModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleModalSubmit = async (data) => {
    if (editingBudget) {
      await handleUpdateBudget(editingBudget.id, data);
    } else {
      await handleCreateBudget(data);
    }
    closeModal();
  };

  return (
    <div className="p-1">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">Budgets</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your monthly spending limits</p>
      </div>

      <BudgetFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        availableYears={availableYears}
        months={months}
        categories={categories}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onCategoryChange={setSelectedCategory}
        onClearFilters={clearFilters}
        onAddBudget={openCreateModal}
      />

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {summary && summary.totalBudget > 0 && (
        <div className="mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="grid grid-cols-3 gap-6">
              <div className='text-center'>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Budget</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatCurrency(summary.totalBudget)}
                </p>
              </div>
              <div className='text-center'>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Categories</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {summary.categoryCount}
                </p>
              </div>
              <div className='text-center'>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Period</p>
                <p className="text-base font-medium text-slate-700 mt-1">
                  {summary.month === 'All' ? 'All Time' : new Date(summary.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
            All Budgets {filteredBudgets.length > 0 && `(${filteredBudgets.length})`}
          </h2>
        </div>
        <BudgetList
          budgets={filteredBudgets}
          onEdit={openEditModal}
          onDelete={handleDeleteBudget}
          onShowForm={openCreateModal}
          loading={loading}
        />
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={editingBudget}
        selectedMonth={selectedMonth ? `${selectedYear}-${selectedMonth.padStart(2, '0')}` : ''}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
        categories={categories}
      />
    </div>
  );
};

export default BudgetManager;