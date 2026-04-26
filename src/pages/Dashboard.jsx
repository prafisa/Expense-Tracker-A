import { useState, useEffect } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import MonthlyChart from "../components/Dashboard/MonthlyChart";
import DonutChart from "../components/Dashboard/DonutChart";
import DailyChart from "../components/Dashboard/DailyChart";
import RecentTransactions from "../components/Dashboard/RecentTransactions";

const API = "https://localhost:7204/api";

// ── automatically calculate date ranges ──────────────────
const getDateRanges = () => {
  const now = new Date();

  // first day of current month → "2026-04-01"
  const currentMonthFrom = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().split("T")[0];

  // last day of current month → "2026-04-30"
  const currentMonthTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().split("T")[0];

  // first day of 6 months ago → "2025-11-01"
  const sixMonthsFrom = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    .toISOString().split("T")[0];

  // last day of current month → "2026-04-30"
  const sixMonthsTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().split("T")[0];

  return { currentMonthFrom, currentMonthTo, sixMonthsFrom, sixMonthsTo };
};

export default function Dashboard() {

  // two separate states — one for current month, one for 6 months
  const [summaryData, setSummaryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // runs once when page loads
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    const {
      currentMonthFrom,
      currentMonthTo,
      sixMonthsFrom,
      sixMonthsTo
    } = getDateRanges();

    try {
      // both API calls run at the same time
      const [summaryRes, monthlyRes] = await Promise.all([

        // call 1 — current month
        // used for: summary cards + donut chart + daily chart + recent list
        fetch(`${API}/dashboard/summary?dateFrom=${currentMonthFrom}&dateTo=${currentMonthTo}`),

        // call 2 — last 6 months
        // used for: monthly bar chart only
        fetch(`${API}/dashboard/summary?dateFrom=${sixMonthsFrom}&dateTo=${sixMonthsTo}`),
      ]);

      if (!summaryRes.ok || !monthlyRes.ok)
        throw new Error("Failed to fetch");

      const summaryJson = await summaryRes.json();
      const monthlyJson = await monthlyRes.json();

      setSummaryData(summaryJson);
      setMonthlyData(monthlyJson);

    } catch (err) {
      setError("Could not load data. Is your API running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── loading ───────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading dashboard...</p>
    </div>
  );

  // ── error ─────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button
          onClick={fetchAllData}
          className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );

  // ── no data ───────────────────────────────────────────────
  if (!summaryData || !monthlyData) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">No data available.</p>
    </div>
  );

  // ── build summary cards — current month ──────────────────
  const summaryCards = [
    {
      label: "Net balance",
      value: `Rs.${summaryData.netBalance.toLocaleString()}`,
      change: "all time balance",
      positive: summaryData.netBalance >= 0
    },
    {
      label: "Total income",
      value: `Rs.${summaryData.periodIncome.toLocaleString()}`,
      change: `${summaryData.incomeRate}% vs previous month`,
      positive: summaryData.incomeRate >= 0
    },
    {
      label: "Total expenses",
      value: `Rs.${summaryData.periodExpense.toLocaleString()}`,
      change: `${summaryData.expenseRate}% vs previous month`,
      positive: summaryData.expenseRate <= 0 // negative expense change is actually good
    },
    {
      label: "Net savings",
      value: `Rs.${summaryData.netSavings.toLocaleString()}`,
      change: `${summaryData.savingsRateChange}% vs last month`,
      positive: summaryData.savingsRateChange >= 0
    }
  ];

  // ── donut chart — current month ──────────────────────────
const categoryChartData = (summaryData.categoryData || []).map((cat) => ({
  name:  cat.name,
  value: cat.percentage,
  color: cat.color,  // ← from database
}));

  // ── recent transactions — current month ──────────────────
  // reshape API data to match component shape
const recentTxns = (summaryData.recentTransactions || []).map(t => ({
  id:     t.id,
  name:   t.name,
  type:   t.type,
  amount: t.amount,
  date:   t.date,
  method: t.method,
  source: t.source,
  category: {
    name:  t.categoryName,
    icon:  t.categoryIcon,   // ← add this
    color: t.categoryColor,  // ← add this
  },
}));
console.log("SUMMARY DATA:", summaryData);
console.log("RECENT TXNS:", summaryData?.recentTransactions);
console.log("FIRST TXN:", summaryData?.recentTransactions?.[0]);
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          })}
        </span>
      </div>

      {/* Summary cards — current month */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                <DailyChart data={summaryData.dailyData || []} />


        {/* donut chart — current month */}
        <div>
          <DonutChart data={categoryChartData} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* recent transactions — current month, last 5 */}
        <RecentTransactions transactions={recentTxns} />
{/* monthly bar chart — last 6 months */}

        <MonthlyChart data={monthlyData.monthlyData || []} />
        {/* daily chart — this week, calculated in controller */}

      </div>

    </div>
  );
}