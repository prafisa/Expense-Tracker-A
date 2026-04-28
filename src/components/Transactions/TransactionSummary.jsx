const TransactionSummary = ({ summary }) => {
  const { totalIncome, totalExpense, balance, transactionCount } = summary

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Total Income</p>
        <p className="text-xl font-medium text-green-600">Rs. {totalIncome.toLocaleString()}</p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
        <p className="text-xl font-medium text-red-500">Rs. {totalExpense.toLocaleString()}</p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Net Balance</p>
        <p className="text-xl font-medium text-blue-500">Rs. {balance.toLocaleString()}</p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Transactions</p>
        <p className="text-xl font-medium text-gray-800">{transactionCount}</p>
      </div>
    </div>
  )
}

export default TransactionSummary