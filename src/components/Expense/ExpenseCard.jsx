import { Trash2 } from 'lucide-react'

function ExpenseCard({ expense }) {
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
        <button className="flex items-center gap-1 text-rose-400 text-sm border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors">
          <Trash2 size={13} />
          Delete
        </button>
      </td>

    </tr>
  )
}

export default ExpenseCard