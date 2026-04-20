// import CategoryIcon from "../CategoryIcon";

const sourceLabels = {
  CASH: "Cash",
  ESEWA: "eSewa",
  KHALTI: "Khalti",
  MOBILE_BANKING: "Mobile Banking",
};

const sourceColors = {
  CASH: "bg-gray-100 text-gray-600",
  ESEWA: "bg-green-100 text-green-700",
  KHALTI: "bg-purple-100 text-purple-700",
  MOBILE_BANKING: "bg-blue-100 text-blue-700",
};

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mb-6">
        <p className="text-gray-400 text-sm">No transactions found.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Category</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Name</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Date</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Source</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Type</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Amount</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(txn => (
            <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

              {/* Category */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* <CategoryIcon categoryName={txn.category.name} size="sm" /> */}
                  <div>
                    <p className="text-sm text-gray-700">{txn.category.name}</p>
                  </div>
                </div>
              </td>

              {/* Name + reason */}
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-800">{txn.name}</p>
                {txn.reason && (
                  <p className="text-xs text-gray-400">{txn.reason}</p>
                )}
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-sm text-gray-500">{txn.date}</td>

              {/* Source */}
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-md ${sourceColors[txn.source]}`}>
                  {sourceLabels[txn.source]}
                </span>
              </td>

              {/* Type */}
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  txn.type === "INCOME"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {txn.type === "INCOME" ? "Income" : "Expense"}
                </span>
              </td>

              {/* Amount */}
              <td className={`px-4 py-3 text-sm font-medium ${
                txn.type === "INCOME" ? "text-green-600" : "text-red-500"
              }`}>
                {txn.type === "INCOME" ? `+Rs.${txn.amount}` : `-Rs.${txn.amount}`}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(txn.id)}
                    className="text-xs px-3 py-1 border border-red-200 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;