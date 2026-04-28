import { PieChart, Pie, Cell, Tooltip } from "recharts";

const FALLBACK = ["#378ADD","#1D9E75","#EF9F27","#D4537E","#7F77DD","#D85A30"];

const DonutChart = ({ data = [] }) => {
  console.log("DonutChart data:", data); // ← check this

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-700">
          Spending by category
        </p>
        <span className="text-xs text-gray-400">This month</span>
      </div>

      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-gray-300 text-sm">No expense data</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.map((item, index) => (
              <span
                key={item.name}
                className="flex items-center gap-1 text-xs text-gray-500"
              >
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{
                    // use database color if available, else fallback
                    backgroundColor: item.color || FALLBACK[index % FALLBACK.length]
                  }}
                ></span>
                {item.name} {item.value}%
              </span>
            ))}
          </div>

          <div className="flex justify-center">
            <PieChart width={220} height={220}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                dataKey="value"
              >
                {data.map((item, index) => (
                  <Cell
                    key={index}
                    fill={item.color || FALLBACK[index % FALLBACK.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </div>
        </>
      )}
    </div>
  );
};

export default DonutChart;