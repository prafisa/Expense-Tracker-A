import { Trash2 } from 'lucide-react'

function ExpenseCard({ expense }) {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 mb-3 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-slate-800">{expense.title}</h3>
                <p className="text-sm text-slate-500">Category: {expense.category} | Date: {expense.date}</p>
                <p className="text-base font-bold text-rose-600 mt-1">Rs. {expense.amount}</p>
            </div>
            <button className="flex items-center gap-1 text-slate-400 text-sm">
                <Trash2 size={15} />
                Delete
            </button>
        </div>
    );
}

export default ExpenseCard;