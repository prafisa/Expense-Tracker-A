export default function TransactionItem({ transaction }) {
  const sign = transaction.amount < 0 ? "-" : "+";

  return (
    <li
      className={`flex justify-between items-center p-3 rounded shadow-sm border-l-4 ${
        transaction.amount < 0
          ? "border-red-500 bg-red-50"
          : "border-green-500 bg-green-50"
      }`}
    >
      <span>{transaction.text}</span>
      <span className="font-semibold">
        {sign}Rs {Math.abs(transaction.amount)}
      </span>
    </li>
  );
}