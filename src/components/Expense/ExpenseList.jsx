import ExpenseCard from './ExpenseCard'

const METHODS = ["CASH", "ESEWA", "KHALTI", "MOBILE_BANKING"]

function ExpenseList({ expenses, categories, filters, onFilterChange, onClear, onDelete }) {
  return (
    <div className="flex flex-col gap-4">

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={filters.search}
            onChange={e => onFilterChange("search", e.target.value)}
            className="flex-1 min-w-48 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600"
          />

          <select
            value={filters.category}
            onChange={e => onFilterChange("category", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={filters.method}
            onChange={e => onFilterChange("method", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
          >
            <option value="">All methods</option>
            {METHODS.map(m => (
              <option key={m} value={m}>{m.replace("_", " ")}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => onFilterChange("dateFrom", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => onFilterChange("dateTo", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
          />

          <button
            onClick={onClear}
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl p-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-xs font-medium text-slate-400 text-left pb-3">CATEGORY</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">NAME</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">DATE</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">METHOD</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">AMOUNT</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-sm text-slate-400 py-8">
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map(expense => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ExpenseList