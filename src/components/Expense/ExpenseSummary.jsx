function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const count = expenses.length
  const avg = count > 0 ? Math.round(total / count) : 0

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Total spent</p>
        <p className="text-xl font-medium text-red-600">-Rs.{total}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">This month</p>
        <p className="text-xl font-medium text-red-600">-Rs. {total}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Avg per transaction</p>
        <p className="text-xl font-medium text-gray-700">Rs. {avg}</p>
      </div>

    </div>
  )
}

export default ExpenseSummary;