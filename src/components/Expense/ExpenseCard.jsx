function ExpenseCard({ expense, onEdit, onDelete }) {   
  return (
    <tr className="border-b border-slate-100 last:border-b-0">

      <td className="py-4">
        <span className="bg-violet-50 text-violet-600 text-xs px-3 py-1 rounded-full">
          {expense.categoryName}
        </span>
      </td>

      <td className="py-4">
        <p className="text-sm font-semibold text-slate-800">{expense.reason}</p>
        <p className="text-xs text-slate-400 mt-0.5">{expense.categoryName}</p>
      </td>

      <td className="py-4">
        <p className="text-sm text-slate-400">{expense.date.split('T')[0]}</p>
      </td> 

      <td className="py-4">
        <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">
          {expense.method === 1 ? 'Mobile Banking' : 
           expense.method === 2 ? 'eSewa' : 
           expense.method === 3 ? 'Cash' : 'Other'}
        </span>
      </td>

      <td className="py-4">
        <p className="text-sm font-semibold text-rose-500">- Rs. {expense.amount}</p>
      </td>

      <td className="py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-slate-500 text-sm border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-rose-400 text-sm border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>

    </tr>
  )
}

export default ExpenseCard