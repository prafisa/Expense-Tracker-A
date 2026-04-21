import TransactionSummary from "../components/Transactions/TransactionSummary";
import TransactionFilters from "../components/Transactions/TransactionFilters";
import TransactionTable from "../components/Transactions/TransactionTable";
import Pagination from "../components/shared/Pagination";
import data from "../data/transactions.json";
import ItemModal from "../components/shared/ItemModal";
import categoriesData from "../data/dashboardData.json";
import { useState } from "react";

const allCategories = [
  { id: 1, name: "Salary", icon: "💼", type: "INCOME" },
  { id: 2, name: "Freelance", icon: "💻", type: "INCOME" },
  { id: 3, name: "Investment", icon: "📈", type: "INCOME" },
  { id: 4, name: "Food & Dining", icon: "🍜", type: "EXPENSE" },
  { id: 5, name: "Transport", icon: "🚌", type: "EXPENSE" },
  { id: 6, name: "Health", icon: "💊", type: "EXPENSE" },
  { id: 7, name: "Utilities", icon: "💡", type: "EXPENSE" },
  { id: 8, name: "Shopping", icon: "🛍️", type: "EXPENSE" },
  { id: 9, name: "Entertainment", icon: "🎮", type: "EXPENSE" },
];

export default function Transaction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleSave = (formData) => {
    console.log("saved:", formData); // placeholder until API
    handleClose();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add transaction
        </button>
      </div>

      <TransactionSummary />
      <TransactionFilters />
      <TransactionTable transactions={data.transactions} />
      <Pagination />

      <ItemModal
        open={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        editData={editData}
        categories={allCategories} 
      />
    </div>
  );
}
