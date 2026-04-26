import CategoryIcon from "../shared/CategoryIcon";

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

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-700">Recent transactions</p>
        <span className="text-xs text-gray-400">This month</span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-300 text-sm">No transactions this month</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5">

          {transactions.slice(0, 5).map((txn) => (
            <div key={txn.id}>

              <li className="flex items-center justify-between px-2.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">

                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">

                  {/* ICON (FIX IS HERE) */}
                  <CategoryIcon
                    iconName={txn.category?.icon}
                    color={txn.category?.color}
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-gray-800 truncate">
                      {txn.source}
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">

                      <span className="text-xs text-gray-400">
                        {new Date(txn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      <span className="text-gray-300 text-xs">·</span>

                      <span className="text-xs text-gray-400 truncate">
                        {txn.category?.name}
                      </span>

                      <span className="text-gray-300 text-xs">·</span>

                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        sourceColors[txn.method] || "bg-gray-100 text-gray-600"
                      }`}>
                        {sourceLabels[txn.method] || txn.method}
                      </span>

                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-1 ml-3 shrink-0">

                  <span className={`text-sm font-medium ${
                    txn.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                    {txn.type === "INCOME"
                      ? `+Rs.${txn.amount.toLocaleString()}`
                      : `-Rs.${txn.amount.toLocaleString()}`}
                  </span>

                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    txn.type === "INCOME"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}>
                    {txn.type === "INCOME" ? "Income" : "Expense"}
                  </span>

                </div>

              </li>

            </div>
          ))}

        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;