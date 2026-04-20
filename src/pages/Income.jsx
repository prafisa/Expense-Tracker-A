import IncomeSummary from "../components/Income/IncomeSummary";
import IncomeFilters from "../components/Income/IncomeFilters";
import IncomeTable from "../components/Income/IncomeTable";
import Pagination from "../components/Income/Pagination";
import incomeData from "../data/income.json";
import IncomeList from "../components/Income/IncomeList";


export default function Income() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Income</h1>
      </div>

      {/* Summary */}
      <IncomeSummary transactions={incomeData.transactions} />

      {/* Filters */}
      <IncomeFilters />
      {/* <IncomeList incomes={incomeData.transactions}/> */}

      {/* Table */}
      <IncomeTable transactions={incomeData.transactions} />

      {/* Pagination */}
      <Pagination />

    </div>
  );
}