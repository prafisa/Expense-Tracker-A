const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Health",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Salary",
  "Freelance",
];

const TransactionFilters = () => {
  return (
    <div className="flex flex-wrap gap-3 mb-5 items-center">
      <input
        type="text"
        placeholder="Search transactions..."
        className="flex-1 min-w-[150px] px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none cursor-pointer min-w-[130px]">
        <option>All Types</option>
        <option>INCOME</option>
        <option>EXPENSE</option>
      </select>

      <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none cursor-pointer min-w-[150px]">
        <option>All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="date"
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <input
        type="date"
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none"
      />

      <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-500 cursor-pointer hover:bg-gray-50">
        Clear
      </button>
    </div>
  );
};

export default TransactionFilters;