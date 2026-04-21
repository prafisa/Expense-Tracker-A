import ExpenseCard from './ExpenseCard'

function ExpenseList({ expenses, onEdit, onDelete }) {   
  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white border border-slate-100 rounded-xl px-5 py-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-1 min-w-48 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600"
          />
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500">
            <option value="">All categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500">
            <option value="">All sources</option>
            <option value="Cash">Cash</option>
            <option value="eSewa">eSewa</option>
            <option value="Mobile Banking">Mobile Banking</option>
            <option value="Other">Other</option>
          </select>
          <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500" />
          <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500" />
          <button className="text-sm text-slate-400 hover:text-slate-600">Clear</button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-xs font-medium text-slate-400 text-left pb-3">CATEGORY</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">NAME</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">REASON</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">DATE</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">SOURCE</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">AMOUNT</th>
              <th className="text-xs font-medium text-slate-400 text-left pb-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={onEdit}           
                onDelete={onDelete}       
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ExpenseList