import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (tx) => {
    setTransactions([...transactions, { ...tx, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
           Transaction Tracker
        </h1>

        <TransactionForm addTransaction={addTransaction} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}