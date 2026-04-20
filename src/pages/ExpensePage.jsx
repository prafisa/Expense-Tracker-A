import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummery from "../components/ExpenseSummery";
import expenses from "../data/expenses";

function ExpensePage(){
    return(
        <div className="min-h-screen bg-slate-100 py-8">
            <div className="max-w-xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">
                    Expense Tracker
                </h1>
                <ExpenseSummery expenses={expenses}/>
                <ExpenseForm/>
                <ExpenseList expenses={expenses}/>
            </div>
        </div>
    );
}
export default ExpensePage;