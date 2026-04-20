import { useState } from 'react'
import ExpenseList from '../components/Expense/ExpenseList'
import ExpenseSummary from '../components/Expense/ExpenseSummary'
import ExpenseModal from '../components/Expense/ExpenseModal'
import expenses from '../data/expenses'

function ExpensePage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Expenses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          + Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExpenseSummary expenses={expenses} />
        <div className="md:col-span-2">
          <ExpenseList expenses={expenses} />
        </div>
      </div>

      {showModal && (
        <ExpenseModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default ExpensePage