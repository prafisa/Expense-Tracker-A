function ExpenseSummery({expenses}){
    const total = expenses.reduce((sum,expense) => sum + expense.amount,0); //sum starts at 0 and keeps addign each expense amount
    // loops through all expenses and adds up all the amounts into one total
    

    return(
        <div className="bg-gray-800 text-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold">Total Spent</h2>
            <p className="text-3xl font-bold mt-1">Rs. {total}</p>
        </div>
    );

}
export default ExpenseSummery;