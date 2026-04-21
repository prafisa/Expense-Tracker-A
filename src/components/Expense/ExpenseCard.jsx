import { Trash2, Pencil } from 'lucide-react'

function ExpenseCard({ expense, onEdit, onDelete }) {   
  return (
    <tr className="border-b border-slate-100 last:border-b-0">

      <td className="py-4">
        <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">
          {expense.category}
        </span>
      </td>

      <td className="py-4">
        <p className="text-sm font-semibold text-slate-800">{expense.title}</p>
      </td>

      <td className="py-4">
        <p className="text-sm text-slate-400">{expense.reason}</p>
      </td>

      <td className="py-4">
        <p className="text-sm text-slate-400">{expense.date}</p>
      </td>

      <td className="py-4">
        <span className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full">
          {expense.source}
        </span>
      </td>

      <td className="py-4">
        <p className="text-sm font-semibold text-rose-500">- Rs. {expense.amount}</p>
      </td>

      <td className="py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="flex items-center gap-1 text-blue-400 text-sm border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="flex items-center gap-1 text-rose-400 text-sm border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </td>

    </tr>
  )
}

export default ExpenseCard