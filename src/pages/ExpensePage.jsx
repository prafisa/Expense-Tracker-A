import { useState, useEffect } from "react";
import ExpenseSummary from "../components/Expense/ExpenseSummary";
import ExpenseList from "../components/Expense/ExpenseList";
import ItemModal from "../components/shared/ItemModal";
import { expenseService } from "../services/expenseService";
import { categoryService } from "../services/CategoryService";

function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [expenseData, categoryData] = await Promise.all([
          expenseService.getAllExpenses(),
          categoryService.getAllCategories()
        ]);

        setExpenses(expenseData);

        const expenseCats = categoryData.filter(
          c => c.type?.toUpperCase() === "EXPENSE"
        );

        setCategories(expenseCats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      const backendData = {
        method: formData.method ?? 0,
        reason: formData.title,
        amount: formData.amount,
        date: formData.date,
        categoryId: formData.categoryId,
      };

      const newExpense = await expenseService.createExpense(backendData);

      setExpenses(prev => [newExpense, ...prev]);
      setModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleClose = () => setModal(false);

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  if (error)
    return <div className="p-6 text-sm text-red-500">Error: {error}</div>;

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

      <ExpenseSummary expenses={expenses} />

  
      <ExpenseList
        expenses={expenses}
        onDelete={handleDelete}
      />

      <ItemModal
        open={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        lockedType="expense"
        categories={categories}
      />

    </div>
  );
}

export default ExpensePage;