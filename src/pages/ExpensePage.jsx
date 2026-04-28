import { useState, useEffect } from "react";
import ExpenseSummary from "../components/Expense/ExpenseSummary";
import ExpenseList from "../components/Expense/ExpenseList";
import ItemModal from "../components/shared/ItemModal";
import { expenseService } from "../services/expenseService";
import { categoryService } from "../services/CategoryService";

const EMPTY_FILTERS = { search: "", category: "", method: "", dateFrom: "", dateTo: "" };

function ExpensePage() {
  const [expenses, setExpenses]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setModal]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filters, setFilters]       = useState(EMPTY_FILTERS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expenseData, categoryData] = await Promise.all([
          expenseService.getAllExpenses(),
          categoryService.getAllCategories()
        ]);
        setExpenses(expenseData);
        setCategories(categoryData.filter(c => c.type?.toUpperCase() === "EXPENSE"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = expenses.filter(e => {
    if (filters.search   && !e.reason?.toLowerCase().includes(filters.search.toLowerCase())
                         && !e.categoryName?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && e.categoryName !== filters.category) return false
    if (filters.method   && e.method !== filters.method)         return false
    if (filters.dateFrom && e.date?.slice(0, 10) < filters.dateFrom) return false
    if (filters.dateTo   && e.date?.slice(0, 10) > filters.dateTo)   return false
    return true
  });

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const handleSave = async (formData) => {
    try {
      const newExpense = await expenseService.createExpense({
        method:     formData.method ?? 0,
        reason:     formData.note,
        amount:     formData.amount,
        date:       formData.date,
        categoryId: formData.categoryId,
      });
      setExpenses(prev => [newExpense, ...prev]);
      setModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading...</div>;
  if (error)   return <div className="p-6 text-sm text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-800">Expenses</h1>
        <button
          onClick={() => setModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          + Add Expense
        </button>
      </div>

      <ExpenseSummary expenses={filtered} />

      <ExpenseList
        expenses={filtered}
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters(EMPTY_FILTERS)}
        onDelete={handleDelete}
      />

      <ItemModal
        open={isModalOpen}
        onClose={() => setModal(false)}
        onSave={handleSave}
        lockedType="expense"
        categories={categories}
      />
    </div>
  );
}

export default ExpensePage;