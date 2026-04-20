function ExpenseCard({expense}){
    return(
        <div className=" bg-white border border-gray-200 rounded-lg p-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{expense.title}</h3>
            <p className="text=sm text-500 ">Category: {expense.category} | Date: {expense.date}</p>
            <p className="text-base font-bold text-gray-700 mt-1"> Rs.{expense.amount}</p>
            <button className="mt-2 text-sm text-red-500  hover:text-red-700">Delete</button>
        </div>

    );
}
export default ExpenseCard;