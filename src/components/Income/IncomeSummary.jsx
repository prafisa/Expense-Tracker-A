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
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Total income</p>
        <p className="text-xl font-medium text-green-600">
          +Rs. {totalIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">This month</p>
        <p className="text-xl font-medium text-blue-600">
          +Rs. {thisMonthIncome.toLocaleString()}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Avg per transaction</p>
        <p className="text-xl font-medium text-gray-700">
          Rs. {avgIncome.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default IncomeSummary;