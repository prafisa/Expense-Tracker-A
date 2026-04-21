import React from 'react'

const sourceColors = {
  CASH: "bg-gray-100 text-gray-600",
  ESEWA: "bg-green-100 text-green-700",
  KHALTI: "bg-purple-100 text-purple-700",
  MOBILE_BANKING: "bg-blue-100 text-blue-700",
};

const sourceLabels = {
  CASH: "Cash",
  ESEWA: "eSewa",
  KHALTI: "Khalti",
  MOBILE_BANKING: "Mobile Banking",
};

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm font-medium text-gray-700 mb-3">
        Recent Transactions
      </p>

      <ul>
  {transactions.slice(0, 5).map((txn) => (
    <li
      key={txn.id}
      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ backgroundColor: txn.bg }}
        >
          {txn.icon}
        </div> */}
        <div>
          <p className="text-sm font-medium text-gray-800">{txn.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">
              {txn.date} · {txn.category.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${sourceColors[txn.source]}`}>
              {sourceLabels[txn.source]}
            </span>
          </div>
        </div>
      </div>

      {/* Amount */}
      <span className={`text-sm font-medium ${txn.type === "INCOME" ? "text-green-600" : "text-red-500"}`}>
        {txn.type === "INCOME" ? `+Rs. ${txn.amount}` : `-Rs. ${txn.amount}`}
      </span>
    </li>
  ))}
</ul>
    </div>
  );
}

export default RecentTransactions