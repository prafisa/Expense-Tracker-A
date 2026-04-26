import { PieChart, Pie, Cell, Tooltip } from "recharts";

const DonutChart = ({ data = [] }) => {
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
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-3">
            {data.map((item) => (
              <span
                key={item.name}
                className="flex items-center gap-1 text-xs text-gray-500"
              >
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name} {item.value}%
              </span>
            ))}
          </div>

          {/* Chart */}
          <div className="flex justify-center">
            <PieChart width={220} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
              >
                {data.map((item, index) => (
                  <Cell key={index} fill={item.color} />
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