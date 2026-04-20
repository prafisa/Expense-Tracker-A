import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </ul>
      )}
    </div>
  );
}