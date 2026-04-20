export default function IncomeSummary({ incomes }) {
  const now = new Date();
  const monthly = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyTotal = monthly.reduce((s, i) => s + Number(i.amount), 0);
  const allTotal = incomes.reduce((s, i) => s + Number(i.amount), 0);

  const catTotals = {};
  incomes.forEach((i) => {
    catTotals[i.category] = (catTotals[i.category] || 0) + Number(i.amount);
  });
  const topCat = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a])[0] || "—";

  const fmt = (n) =>
    "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-slate-100 rounded-lg p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">This month</p>
        <p className="text-xl font-medium text-green-600">{fmt(monthlyTotal)}</p>
        <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          {monthly.length} {monthly.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="bg-slate-100 rounded-lg p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Top category</p>
        <p className="text-base font-medium text-slate-700">{topCat}</p>
      </div>

      <div className="bg-slate-100 rounded-lg p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Total all time</p>
        <p className="text-xl font-medium text-green-600">{fmt(allTotal)}</p>
      </div>
    </div>
  );
}