import { useState, useMemo } from "react";
import incomeData from "../data/income.json";
import IncomeSummary from "../components/Income/IncomeSummary";
import IncomeFilters from "../components/Income/IncomeFilters";
import IncomeTable from "../components/Income/IncomeTable";
import Pagination from "../components/Income/Pagination";

const ITEMS_PER_PAGE = 5;

export default function Income() {
  const [transactions, setTransactions] = useState(incomeData.transactions);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    source: "All",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // apply all filters
  const filtered = useMemo(() => {
    return transactions.filter(txn => {
      const matchSearch   = txn.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === "All" || txn.category.name === filters.category;
      const matchSource   = filters.source === "All" || txn.source === filters.source;
      const matchFrom     = !filters.dateFrom || txn.date >= filters.dateFrom;
      const matchTo       = !filters.dateTo || txn.date <= filters.dateTo;
      return matchSearch && matchCategory && matchSource && matchFrom && matchTo;
    });
  }, [transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this income record?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Income</h1>
      </div>

      {/* Summary */}
      <IncomeSummary transactions={transactions} />

      {/* Filters */}
      <IncomeFilters filters={filters} setFilters={handleFilterChange} />

      {/* Table */}
      <IncomeTable transactions={paginated} onDelete={handleDelete} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

    </div>
  );
}