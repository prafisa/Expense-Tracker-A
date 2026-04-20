function ExpenseForm() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Add Expense</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full border border-gray-300 rounded p-2 mb-3"
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full border border-gray-300 rounded p-2 mb-3"
      />

      <select className="w-full border border-gray-300 rounded p-2 mb-3">
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        className="w-full border border-gray-300 rounded p-2 mb-3"
      />

      <button className="w-full bg-gray-800 text-white rounded p-2 hover:bg-gray-600">
        Add Expense
      </button>
    </div>
  );
}

export default ExpenseForm;