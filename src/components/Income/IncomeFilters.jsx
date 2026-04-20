const incomeCategories = [
  { id: 1, name: "Salary" },
  { id: 2, name: "Freelance" },
];

const IncomeFilters = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        className="flex-1 min-w-40 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Category */}
      <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
        <option value="All">All categories</option>
        {incomeCategories.map(cat => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Source */}
      <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
        <option value="All">All sources</option>
        <option value="CASH">Cash</option>
        <option value="ESEWA">eSewa</option>
        <option value="KHALTI">Khalti</option>
        <option value="MOBILE_BANKING">Mobile Banking</option>
      </select>

      {/* Date from */}
      <input
        type="date"
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Date to */}
      <input
        type="date"
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
      />

      {/* Clear */}
      <button className="text-xs text-gray-400 hover:text-gray-600 underline">
        Clear
      </button>
    </div>
  );
};

export default IncomeFilters;