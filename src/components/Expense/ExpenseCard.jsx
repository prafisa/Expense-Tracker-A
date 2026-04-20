function ExpenseCard({expense}){
    return(
        <div className="bg-white border border-zinc-200 rounded-lg p-4 mb-3">
            <h3 className="text-lg font-semibold text-slate-800">{expense.title}</h3>
            <p className="text-sm text-slate-500">Category: {expense.category} | Date: {expense.date}</p>
            <p className="text-base font-bold text-rose-600 mt-1">Rs. {expense.amount}</p>
            <button className="mt-2 text-sm text-rose-500 hover:text-rose-700">Delete</button>
        </div>
    );
}
export default ExpenseCard;