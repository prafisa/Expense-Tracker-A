// src/components/Budget/BudgetManager.jsx
import React, { useState, useEffect } from 'react';
import BudgetHeader from '../components/Budget/BudgetHeader';
import BudgetFilters from '../components/Budget/BudgetFilters';
import BudgetErrorAlert from '../components/Budget/BudgetErrorAlert';
import BudgetSummaryCard from '../components/Budget/BudgetSummaryCard';
import BudgetListContainer from '../components/Budget/BudgetListContainer';
import BudgetModal from '../components/Budget/BudgetModal';
import { budgetService } from '../services/budgetService';
import { budgetFilterService } from '../services/budgetFilterService';

const months = [
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
];

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [summary, setSummary] = useState(null);

  // Load all budgets and available dates on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter budgets when year/month changes
  useEffect(() => {
    if (budgets.length > 0) {
      const filtered = budgetFilterService.filterBudgets(budgets, selectedYear, selectedMonth);
      setFilteredBudgets(filtered);
      
      const newSummary = budgetFilterService.calculateSummary(filtered, selectedYear, selectedMonth);
      setSummary(newSummary);
    }
  }, [selectedYear, selectedMonth, budgets]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadAllBudgets(), loadAvailableDates()]);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBudgets = async () => {
    try {
      const data = await budgetService.getAllBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

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
    setError(null);
    try {
      await budgetService.deleteBudget(id);
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
    closeModal();
  };

  return (
    <div className="p-1">
      <BudgetHeader />
      
      <BudgetFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        availableYears={availableYears}
        months={months}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onClearFilters={clearFilters}
        onAddBudget={openCreateModal}
      />
      
      <BudgetErrorAlert error={error} onClose={() => setError(null)} />
      
      <BudgetSummaryCard summary={summary} />
      
      <BudgetListContainer
        budgets={filteredBudgets}
        onEdit={openEditModal}
        onDelete={handleDeleteBudget}
        onAddBudget={openCreateModal}
        loading={loading}
      />
      
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