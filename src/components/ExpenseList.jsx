 import ExpenseCard from "./ExpenseCard";

 function ExpenseList({expenses}){
    return(
        <div>
            <h2>All Expenses</h2>
            {expenses.map((expense)=> (
                <ExpenseCard key={expense.id} expense={expense}/>
                // react needs uniqure key for each element in list to optimize rendering and track changes efficiently.
            ))}
        </div>
    );
 }

 export default ExpenseList;