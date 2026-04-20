import { useState } from 'react'
import ExpenseSummary from '../components/Expense/ExpenseSummary'
import ExpenseList from '../components/Expense/ExpenseList'
import ExpenseForm from '../components/Expense/ExpenseForm'
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

      <ExpenseSummary expenses={expenses} />
      <ExpenseList expenses={expenses} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <ExpenseForm onClose={() => setShowModal(false)} />
        </div>
      )}
    </div>
  )
}

export default ExpensePage