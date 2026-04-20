import { useState } from "react";
import IncomeList from "../components/Incomelist";
import IncomeSummary from "../components/Incomesummary";

const DUMMY_DATA = [
  { id: 1, amount: 3200, description: "Monthly salary", category: "Salary",     date: "2026-04-01" },
  { id: 2, amount: 850,  description: "Website project", category: "Freelance",  date: "2026-04-10" },
  { id: 3, amount: 120,  description: "Dividend payout", category: "Investment", date: "2026-04-15" },
  { id: 4, amount: 500,  description: "Online store",    category: "Business",   date: "2026-03-20" },
];

export default function IncomePage() {
  const [incomes, setIncomes] = useState(DUMMY_DATA);

  const handleDelete = (id) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="flex items-center px-6 py-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-sm font-medium text-slate-800">Income</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track your earnings</p>
        </div>
      </div>

      {/* Main */}
      <div className="p-6 flex flex-col gap-4">
        <IncomeSummary incomes={incomes} />
        <IncomeList incomes={incomes} onDelete={handleDelete} />
      </div>
    </div>
  );
}