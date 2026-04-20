import ExpenseCard from "./ExpenseCard"

function ExpenseList({ expenses }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">

      <h2 className="text-sm font-medium text-slate-400 mb-4">All Expenses</h2>

      <div>
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>

    </div>
  )
}

export default ExpenseList