function ExpenseForm({ onClose }) {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 w-full max-w-md">

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-700">Add Expense</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <input
                type="text"
                placeholder="Title"
                className="w-full border border-zinc-300 rounded-md p-2 mb-3"
            />

            <input
                type="number"
                placeholder="Amount"
                className="w-full border border-zinc-300 rounded p-2 mb-3"
            />

            <input
                type="text"
                placeholder="Reason"
                className="w-full border border-zinc-300 rounded p-2 mb-3"
            />

            <select className="w-full border border-zinc-300 rounded p-2 mb-3">
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
            </select>

            <select className="w-full border border-zinc-300 rounded p-2 mb-3">
                <option value="">Select Source</option>
                <option value="Cash">Cash</option>
                <option value="eSewa">eSewa</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Other">Other</option>
            </select>

            <input
                type="date"
                className="w-full border border-zinc-300 rounded p-2 mb-3"
            />

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 border border-zinc-300 text-slate-600 rounded p-2 text-sm hover:bg-zinc-50"
                >
                    Cancel
                </button>
                <button className="flex-1 bg-violet-600 text-white rounded p-2 hover:bg-violet-700">
                    Add Expense
                </button>
            </div>

        </div>
    );
}
export default ExpenseForm;