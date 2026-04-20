function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const count = expenses.length
  const avg = count > 0 ? Math.round(total / count) : 0

  const topCategory = expenses.length > 0
    ? Object.entries(
        expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount
          return acc
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : 'None'

  return (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">

      <div className="rounded-xl overflow-hidden border border-zinc-200">
        <div className="bg-violet-700 px-5 py-6">
          <p className="text-xs font-medium text-violet-300 uppercase tracking-wide mb-2">This Month</p>
          <p className="text-3xl font-semibold text-white">Rs. {total}</p>
        </div>
        <div className="bg-white px-5 py-4">
          <span className="text-xs bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">{count} entries</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-zinc-200">
        <div className="bg-violet-700 px-5 py-6">
          <p className="text-xs font-medium text-violet-300 uppercase tracking-wide mb-2">Top Category</p>
          <p className="text-3xl font-semibold text-white">{topCategory}</p>
        </div>
        <div className="bg-white px-5 py-4">
          <span className="text-xs text-slate-400">Highest spending</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-zinc-200">
        <div className="bg-violet-700 px-5 py-6">
          <p className="text-xs font-medium text-violet-300 uppercase tracking-wide mb-2">Avg per Expense</p>
          <p className="text-3xl font-semibold text-white">Rs. {avg}</p>
        </div>
        <div className="bg-white px-5 py-4">
          <span className="text-xs text-slate-400">{count} transactions</span>
        </div>
      </div>

    </div>
  )
}

export default ExpenseSummary;