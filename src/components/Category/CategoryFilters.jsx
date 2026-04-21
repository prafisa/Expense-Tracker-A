// components/categories/CategoryFilters.jsx

const filters = ["All", "Expense", "Income", "Has budget"];

export default function CategoryFilters({ active = "All" }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          className={`px-3 py-1 rounded-full text-[11px] border transition-colors cursor-default
            ${
              active === f
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}