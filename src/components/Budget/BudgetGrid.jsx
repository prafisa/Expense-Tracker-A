// components/BudgetGrid.jsx
import { Target } from 'lucide-react'
import BudgetRow from './BudgetRow'

export default function BudgetGrid({ budgets, onEdit, onDelete }) {
  if (budgets.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-xl p-12 text-center">
        <Target size={32} className="text-zinc-200 mx-auto mb-3" />
        <p className="text-sm text-zinc-400">No budgets match this filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {budgets.map(b => (
        <BudgetRow
          key={b.id}
          budget={b}
          spent={b.spent}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
