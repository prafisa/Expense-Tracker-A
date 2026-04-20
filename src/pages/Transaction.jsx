import TransactionSummary from "../components/Transactions/TransactionSummary";
import TransactionFilters from "../components/Transactions/TransactionFilters";
import TransactionTable from "../components/Transactions/TransactionTable";
import Pagination from "../components/Transactions/Pagination";
import data from "../data/transactions.json";

export default function Transaction() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Transactions</h1>
        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">
          + Add transaction
        </button>
      </div>

      {/* Summary */}
      <TransactionSummary />

      {/* Filters */}
      <TransactionFilters />

      {/* Table */}
      <TransactionTable transactions={data.transactions} />

      {/* Pagination */}
      <Pagination />

    </div>
  );
}