const incomeCategories = [
  { id: 1, name: "Salary" },
  { id: 2, name: "Freelance" },
];

const IncomeFilters = ({ filters, setFilters }) => {
  const handleClear = () => {
    setFilters({
      search: "",
      category: "All",
      source: "All",
      dateFrom: "",
      dateTo: "",
    });
  };

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

      {/* Category */}
      <select
        value={filters.category}
        onChange={e => setFilters({ ...filters, category: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      >
        <option value="All">All categories</option>
        {incomeCategories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* Source */}
      <select
        value={filters.source}
        onChange={e => setFilters({ ...filters, source: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      >
        <option value="All">All sources</option>
        <option value="CASH">Cash</option>
        <option value="ESEWA">eSewa</option>
        <option value="KHALTI">Khalti</option>
        <option value="MOBILE_BANKING">Mobile Banking</option>
      </select>

      {/* Date from */}
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Date to */}
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Clear */}
      <button
        onClick={handleClear}
        className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Clear
      </button>
    </div>
  );
};

export default IncomeFilters;