import { useState } from "react";
import ExpenseSummary from "../components/Expense/ExpenseSummary";
import ExpenseList from "../components/Expense/ExpenseList";
import initialExpenses from "../data/expenses";
import ItemModal from "../components/shared/ItemModal";
import categoriesData from "../data/dashboardData.json";

const expenseCategories = [
  { id: 1, name: "Food & Dining", icon: "🍜", type: "EXPENSE" },
  { id: 2, name: "Transport", icon: "🚌", type: "EXPENSE" },
  { id: 3, name: "Health", icon: "💊", type: "EXPENSE" },
  { id: 4, name: "Utilities", icon: "💡", type: "EXPENSE" },
  { id: 5, name: "Shopping", icon: "🛍️", type: "EXPENSE" },
  { id: 6, name: "Entertainment", icon: "🎮", type: "EXPENSE" },
];

function ExpensePage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSave = (formData) => {
    if (editData) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === editData.id ? { ...e, ...formData } : e)),
      );
    } else {
      const newId = Math.max(...expenses.map((e) => e.id)) + 1;
      setExpenses((prev) => [{ id: newId, ...formData }, ...prev]);
    }
    setEditData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense?"))
      setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (expense) => {
    setEditData(expense);
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
    setEditData(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Expenses</h1>
        <button
          onClick={() => {
            setEditData(null);
            setModal(true);
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          + Add Expense
        </button>
      </div>

      <ExpenseSummary expenses={expenses} />
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        open={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        editData={editData}
        lockedType="expense"
        categories={expenseCategories} 
      />
    </div>
  );
}

export default ExpensePage;
