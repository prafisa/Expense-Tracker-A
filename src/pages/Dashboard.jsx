import data from "../data/dashboardData.json";
import SummaryCard from "../components/Dashboard/SummaryCard";
import MonthlyChart from "../components/Dashboard/MonthlyChart";
import DonutChart from "../components/Dashboard/DonutChart";

import DailyChart from "../components/Dashboard/DailyChart";
import RecentTransactions from "../components/Dashboard/RecentTransactions";

export default function Dashboard() {
    console.log("categoryData:", data.categoryData)
  return (
    <div className="mx-5 bg-gray-50 p-6" style={{marginLeft:250}}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-400">April 2026</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {data.summary.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="md:col-span-1">
            <DailyChart data={data.dailyData} />
          
        </div>
        <div className="md:col-span-1">
           
          <DonutChart data={data.categories} />
        </div>
      </div>

      {/* Bottom row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentTransactions transactions={data.transactions} />
       <MonthlyChart data={data.monthlyData} />
      </div> 

    </div>
  );
}