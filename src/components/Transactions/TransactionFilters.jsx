const TransactionFilters = ({ filters, setFilters, categories }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
        className="flex-1 min-w-40 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Type toggle */}
      <div className="flex gap-1">
        {["All", "INCOME", "EXPENSE"].map(type => (
          <button
            key={type}
            onClick={() => setFilters({ ...filters, type })}
            className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
              filters.type === type
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {type === "All" ? "All" : type === "INCOME" ? "Income" : "Expense"}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={filters.category}
        onChange={e => setFilters({ ...filters, category: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      >
        <option value="All">All categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Clear filters */}
      <button
        onClick={() => setFilters({ search: "", type: "All", category: "All", dateFrom: "", dateTo: "" })}
        className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Clear
      </button>
    </div>
  );
};

export default TransactionFilters;