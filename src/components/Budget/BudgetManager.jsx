// src/components/Budget/BudgetManager.jsx
import React, { useState, useEffect } from 'react';
import BudgetList from './BudgetList';
import BudgetModal from './BudgetModal';
import BudgetSummary from './BudgetSummary';

const API_BASE_URL = 'https://localhost:7204/api';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [months] = useState([
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [summary, setSummary] = useState(null);

  // Format currency as NPR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(amount).replace('NPR', 'Rs.');
  };

  // Load all budgets and available dates on mount
  useEffect(() => {
    loadAllBudgets();
    loadAvailableDates();
  }, []);

  // Filter budgets when year/month changes
  useEffect(() => {
    filterBudgets();
  }, [selectedYear, selectedMonth, budgets]);

  const loadAllBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/budget`);
      if (!response.ok) throw new Error('Failed to load budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/available-dates`);
      if (!response.ok) throw new Error('Failed to load available dates');
      const data = await response.json();
      setAvailableYears(data.years);
      if (data.years.length > 0 && !selectedYear) {
        setSelectedYear(data.years[data.years.length - 1].toString());
      }
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const filterBudgets = () => {
    let filtered = [...budgets];
    
    if (selectedYear) {
      filtered = filtered.filter(b => b.month.startsWith(selectedYear));
    }
    
    if (selectedMonth) {
      const monthStr = selectedMonth.padStart(2, '0');
      filtered = filtered.filter(b => b.month.endsWith(monthStr));
    }
    
    setFilteredBudgets(filtered);
    
    // Update summary for filtered data
    if (selectedYear && selectedMonth) {
      const monthStr = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      const monthlyBudgets = filtered.filter(b => b.month === monthStr);
      setSummary({
        month: monthStr,
        totalBudget: monthlyBudgets.reduce((sum, b) => sum + b.allocated, 0),
        categoryCount: monthlyBudgets.length
      });
    } else if (filtered.length > 0) {
      setSummary({
        month: 'All',
        totalBudget: filtered.reduce((sum, b) => sum + b.allocated, 0),
        categoryCount: filtered.length
      });
    } else {
      setSummary(null);
    }
  };

  const handleCreateBudget = async (budgetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create budget');
      }
      
      await loadAllBudgets();
      await loadAvailableDates();
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to let modal know it failed
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (id, budgetData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Updating budget:', id, budgetData);
      
      const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      
      const responseText = await response.text();
      console.log('Response:', response.status, responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to update budget';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      await loadAllBudgets();
      await loadAvailableDates();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
      throw err; // Re-throw to let modal know it failed
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/budget/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error('Failed to delete budget');
      
      await loadAllBudgets();
      await loadAvailableDates();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedYear('');
    setSelectedMonth('');
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
  };

  return (
    <div className="p-1">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">Budgets</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your monthly spending limits</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            {(selectedYear || selectedMonth) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-md hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Budget
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md">
          <div className="flex items-start justify-between">
            <p className="text-sm text-rose-700">{error}</p>
            <button onClick={() => setError(null)} className="text-rose-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && summary.totalBudget > 0 && (
        <div className="mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Budget</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatCurrency(summary.totalBudget)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Categories</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {summary.categoryCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Period</p>
                <p className="text-base font-medium text-slate-700 mt-1">
                  {summary.month === 'All' ? 'All Time' : new Date(summary.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget List */}
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

      {/* Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={editingBudget}
        selectedMonth={selectedMonth ? `${selectedYear}-${selectedMonth.padStart(2, '0')}` : ''}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
      />
    </div>
  );
};

export default BudgetManager;