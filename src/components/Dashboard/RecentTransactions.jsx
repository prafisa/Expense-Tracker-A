const sourceLabels = {
  CASH:           "Cash",
  ESEWA:          "eSewa",
  KHALTI:         "Khalti",
  MOBILE_BANKING: "Mobile Banking",
};

const sourceColors = {
  CASH:           "bg-gray-100 text-gray-600",
  ESEWA:          "bg-green-100 text-green-700",
  KHALTI:         "bg-purple-100 text-purple-700",
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

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-700">
          Recent transactions
        </p>
        <span className="text-xs text-gray-400">Last 5</span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-300 text-sm">No transactions this month</p>
        </div>
      ) : (
        <ul>
          {transactions.slice(0, 5).map((txn) => (
            <li
              key={txn.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                {/* category pill */}
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                  categoryColors[txn.category?.name] || "bg-gray-100 text-gray-600"
                }`}>
                  {txn.category?.name}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {txn.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* date */}
                    <span className="text-xs text-gray-400">
                      {new Date(txn.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric"
                      })}
                    </span>
                    {/* method badge */}
                    <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                      sourceColors[txn.method] || "bg-gray-100 text-gray-600"
                    }`}>
                      {sourceLabels[txn.method] || txn.method}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <span className={`text-sm font-medium shrink-0 ${
                txn.type === "INCOME" ? "text-green-600" : "text-red-500"
              }`}>
                {txn.type === "INCOME"
                  ? `+$${txn.amount.toLocaleString()}`
                  : `-$${txn.amount.toLocaleString()}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;