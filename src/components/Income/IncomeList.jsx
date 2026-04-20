const CAT_BG = {
  Salary: "bg-green-100",
  Freelance: "bg-blue-100",
  Investment: "bg-yellow-100",
  Business: "bg-pink-100",
  Other: "bg-slate-100",
};

export default function IncomeList({ incomes }) {
  const fmt = (n) =>
    "Rs. " +
    Number(n).toLocaleString("ne-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const sorted = [...incomes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-2">
        Recent income
      </p>

      <div className="flex flex-col gap-2">
        {sorted.map((item) => {
          const dateStr = new Date(item.date).toLocaleDateString("ne-NP", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3"
            >
              {/* ICON */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  CAT_BG[item.category.name] || "bg-slate-100"
                }`}
              />

              {/* TEXT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {item.description || item.category.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.category.name}
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {fmt(item.amount)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dateStr}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}