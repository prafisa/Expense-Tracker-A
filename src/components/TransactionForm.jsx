import { useState } from "react";

export default function TransactionForm({ addTransaction }) {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    addTransaction({
      text,
      amount: +amount,
    });

    setText("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter description..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="number"
        placeholder="Enter amount (+income, -expense)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Add Transaction
      </button>
    </form>
  );
}