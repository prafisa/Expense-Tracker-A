export default function CategoryFilters({ filters, setFilters }) {

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      type,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search category..."
          value={filters.search}
          onChange={handleSearchChange}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange("All")}
            className={`px-4 py-2 text-sm rounded-lg ${
              filters.type === "All"
                ? "bg-blue-500 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All
          </button>

          <button
            onClick={() => handleTypeChange("Income")}
            className={`px-4 py-2 text-sm rounded-lg ${
              filters.type === "Income"
                ? "bg-green-500 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Income
          </button>

          <button
            onClick={() => handleTypeChange("Expense")}
            className={`px-4 py-2 text-sm rounded-lg ${
              filters.type === "Expense"
                ? "bg-red-500 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Expense
          </button>
        </div>
      </div>
    </div>
  );
}