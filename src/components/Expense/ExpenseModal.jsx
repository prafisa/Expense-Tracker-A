function ExpenseModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Add Expense</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <input
          type="text"
          placeholder="Title"
          className="w-full border border-zinc-200 rounded-lg p-2.5 mb-3 text-sm text-slate-700"
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full border border-zinc-200 rounded-lg p-2.5 mb-3 text-sm text-slate-700"
        />

        <select className="w-full border border-zinc-200 rounded-lg p-2.5 mb-3 text-sm text-slate-700">
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          className="w-full border border-zinc-200 rounded-lg p-2.5 mb-5 text-sm text-slate-700"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-zinc-200 text-slate-600 rounded-lg p-2.5 text-sm hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button className="flex-1 bg-violet-600 text-white rounded-lg p-2.5 text-sm hover:bg-violet-700">
            Save Expense
          </button>
        </div>

      </div>
    </div>
  )
}

export default ExpenseModal