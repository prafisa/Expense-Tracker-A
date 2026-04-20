const IncomeSummary = ({ transactions }) => {
  const totalIncome = transactions
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthIncome = transactions
    .filter(t => t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const avgIncome = transactions.length > 0
    ? Math.round(totalIncome / transactions.length)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-xs text-gray-500 mb-1">Total Income</p>
        <p className="text-xl font-medium text-green-600">
          +Rs {totalIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-xs text-gray-500 mb-1">This month</p>
        <p className="text-xl font-medium text-red-500">
          +Rs {thisMonthIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-xs text-gray-500 mb-1">Avg per transaction</p>
        <p className="text-xl font-medium text-blue-500">
          Rs {avgIncome.toLocaleString()}
        </p>
      </div>

    </div>

  );
};

export default IncomeSummary;

