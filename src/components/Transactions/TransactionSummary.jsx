import transactions from "../../data/transactions.json";

const TransactionSummary = () => {
  const allTxn = transactions.transactions;

  const totalIncome = allTxn
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = allTxn
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Total Income</p>
        <p className="text-xl font-medium text-green-600">
          Rs. {totalIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
        <p className="text-xl font-medium text-red-500">
          Rs. {totalExpense.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Net Balance</p>
        <p className="text-xl font-medium text-blue-500">
          Rs. {netBalance.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Transactions</p>
        <p className="text-xl font-medium text-gray-800">{allTxn.length}</p>
      </div>
    </div>
  );
};

export default TransactionSummary;