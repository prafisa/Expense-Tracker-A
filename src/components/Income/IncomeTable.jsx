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

const categoryColors = {
  "Salary":        "bg-blue-100 text-blue-800",
  "Freelance":     "bg-indigo-100 text-indigo-800",
  "Food & Dining": "bg-orange-100 text-orange-800",
  "Transport":     "bg-yellow-100 text-yellow-800",
  "Health":        "bg-red-100 text-red-800",
  "Utilities":     "bg-purple-100 text-purple-800",
  "Shopping":      "bg-pink-100 text-pink-800",
  "Entertainment": "bg-green-100 text-green-800",
};

const IncomeTable = ({ transactions, onEdit, onDelete }) => {  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mb-6">
        <p className="text-gray-400 text-sm">No income records found.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting your filters.</p>
      </div>
    )
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
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Amount</th>
            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(txn => (   // ← removed slice(0,5), pagination handles this
            <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">

              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  categoryColors[txn.category.name] || "bg-gray-100 text-gray-600"
                }`}>
                  {txn.category.name}
                </span>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-800">{txn.name}</p>
                {txn.reason && <p className="text-xs text-gray-400">{txn.reason}</p>}
              </td>

              <td className="px-4 py-4 text-sm text-gray-500">{txn.date}</td>

              <td className="px-4 py-4">
                <span className={`text-xs px-2 py-1 rounded-md ${sourceColors[txn.source]}`}>
                  {sourceLabels[txn.source]}
                </span>
              </td>

              <td className="px-4 py-4 text-sm font-medium text-green-600">
                +Rs. {txn.amount.toLocaleString()}
              </td>

              {/* Actions — edit + delete */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className="text-xs px-3 py-1 border border-blue-200 rounded-lg text-blue-500 hover:bg-blue-50"
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
  )
}

export default IncomeTable;