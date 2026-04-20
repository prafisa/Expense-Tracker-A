const TransactionSummary = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Total income</p>
        <p className="text-xl font-medium text-green-600">
          +Rs.{totalIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Total expenses</p>
        <p className="text-xl font-medium text-red-500">
          -Rs.{totalExpense.toLocaleString()}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Net balance</p>
        <p className={`text-xl font-medium ${netBalance >= 0 ? "text-blue-600" : "text-red-500"}`}>
          Rs.{netBalance.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TransactionSummary;