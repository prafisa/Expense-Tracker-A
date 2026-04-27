const IncomeFilters = ({ categories, filters, onFilterChange, onClear }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">

      <input
        type="text"
        placeholder="Search by name..."
        value={filters.search}
        onChange={e => onFilterChange("search", e.target.value)}
        className="flex-1 min-w-40 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      <select
        value={filters.category}
        onChange={e => onFilterChange("category", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      >
        <option value="">All categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filters.source}
        onChange={e => onFilterChange("source", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      >
        <option value="">All sources</option>
        <option value="CASH">Cash</option>
        <option value="ESEWA">eSewa</option>
        <option value="KHALTI">Khalti</option>
        <option value="MOBILE_BANKING">Mobile Banking</option>
      </select>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => onFilterChange("dateFrom", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={e => onFilterChange("dateTo", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      <button
        onClick={onClear}
        className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Clear
      </button>
    </div>
  )
}

export default IncomeFilters