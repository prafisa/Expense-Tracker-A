import CategoryIcon from "../shared/CategoryIcon"

const sourceLabels = {
  CASH:           "Cash",
  ESEWA:          "eSewa",
  KHALTI:         "Khalti",
  MOBILE_BANKING: "Mobile Banking",
}

const sourceColors = {
  CASH:           "bg-gray-100 text-gray-600",
  ESEWA:          "bg-green-100 text-green-700",
  KHALTI:         "bg-purple-100 text-purple-700",
  MOBILE_BANKING: "bg-blue-100 text-blue-700",
}

const IncomeTable = ({ transactions, onDelete }) => {
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
          {transactions.map(txn => (
            <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">

              {/* Category with icon */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon
                    iconName={txn.category?.icon}
                    color={txn.category?.color}
                    size={14}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {txn.category?.name}
                  </span>
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-800">{txn.name}</p>
              </td>

              <td className="px-4 py-4 text-sm text-gray-500">
                {txn.date?.slice(0, 10)}
              </td>

              <td className="px-4 py-4">
                <span className={`text-xs px-2 py-1 rounded-md ${sourceColors[txn.source] ?? "bg-gray-100 text-gray-600"}`}>
                  {sourceLabels[txn.source] ?? txn.source}
                </span>
              </td>

              <td className="px-4 py-4 text-sm font-medium text-green-600">
                +Rs. {txn.amount?.toLocaleString()}
              </td>

              <td className="px-4 py-4">
                <button
                  onClick={() => onDelete(txn.id)}
                  className="text-xs px-3 py-1 border border-red-200 rounded-lg text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IncomeTable