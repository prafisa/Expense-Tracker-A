import { useState, useMemo } from "react";
import transactionData from "../data/transactions.json";
import TransactionSummary from "../components/Transactions/TransactionSummary";
import TransactionFilters from "../components/Transactions/TransactionFilters";
import TransactionTable from "../components/Transactions/TransactionTable";
// import TransactionModal from "../components/transactions/TransactionModal";
import Pagination from "../components/Transactions/Pagination";
import categoriesData from "../data/dashboardData.json";

const ITEMS_PER_PAGE = 5;

export default function Transaction() {
  const [transactions, setTransactions] = useState(transactionData.transactions);
  const [filters, setFilters] = useState({ search: "", type: "All", category: "All", dateFrom: "", dateTo: "" });
  const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // apply all filters
  const filtered = useMemo(() => {
    return transactions.filter(txn => {
      const matchSearch = txn.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "All" || txn.type === filters.type;
      const matchCategory = filters.category === "All" || txn.category.name === filters.category;
      const matchFrom = !filters.dateFrom || txn.date >= filters.dateFrom;
      const matchTo = !filters.dateTo || txn.date <= filters.dateTo;
      return matchSearch && matchType && matchCategory && matchFrom && matchTo;
    });
  }, [transactions, filters]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // add new transaction
  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  // open edit modal
  const handleEdit = (txn) => {
    setEditData(txn);
    setIsModalOpen(true);
  };

  // delete transaction
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // save — handles both add and edit
  const handleSave = (formData) => {
    if (editData) {
      // update existing
      setTransactions(prev =>
        prev.map(t => t.id === editData.id ? { ...t, ...formData } : t)
      );
    } else {
      // add new with a unique id
      const newId = Math.max(...transactions.map(t => t.id)) + 1;
      setTransactions(prev => [...prev, { id: newId, ...formData }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Transactions</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add transaction
        </button>
      </div>

      {/* Summary */}
      <TransactionSummary transactions={transactions} />

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        setFilters={handleFilterChange}
        categories={categoriesData.categories}
      />

      {/* Table */}
      <TransactionTable
        transactions={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {/* <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editData}
      /> */}
    </div>
  );
}