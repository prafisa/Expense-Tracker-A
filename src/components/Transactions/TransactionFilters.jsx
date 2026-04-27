const TransactionFilters = ({ categories, filters, onFilterChange, onClear }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-5 items-center">

      <input
        type="text"
        placeholder="Search transactions..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        className="flex-1 min-w-[150px] px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <select
        value={filters.type}
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none cursor-pointer min-w-[130px]"
      >
        <option value="">All Types</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) => onFilterChange("category", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none cursor-pointer min-w-[150px]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onFilterChange("dateFrom", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onFilterChange("dateTo", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <button
        onClick={onClear}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-500 cursor-pointer hover:bg-gray-50"
      >
        Clear
      </button>

    </div>
  )
}

export default TransactionFilters