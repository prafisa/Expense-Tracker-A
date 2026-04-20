export default function CategorySummary({ categories }) {
  const total = categories.length;

  const incomeCount = categories.filter(
    (cat) => cat.type === "Income"
  ).length;

  const expenseCount = categories.filter(
    (cat) => cat.type === "Expense"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Total Categories */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm text-gray-500">Total Categories</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-1">
          {total}
        </h2>
      </div>

      {/* Income Categories */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm text-gray-500">Income Categories</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-1">
          {incomeCount}
        </h2>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm text-gray-500">Expense Categories</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-1">
          {expenseCount}
        </h2>
      </div>

    </div>
  );
}