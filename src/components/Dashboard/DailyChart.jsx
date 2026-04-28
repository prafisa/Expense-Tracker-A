import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer
} from "recharts";

const DailyChart = ({ data = [] }) => {

  // JS: Sun=0, Mon=1 ... Sat=6 — matches Nepal week starting Sunday
  const todayIndex = new Date().getDay();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-700">
          Daily spending this week
        </p>
        <span className="text-xs text-gray-400">Sun — Sat</span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#534AB7" }}
          ></span>
          Today
        </span>
      </div>

      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-gray-300 text-sm">No data available</p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `Rs.${v}`}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(v) => `Rs.${v}`} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === todayIndex ? "#534AB7" : "#AFA9EC"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DailyChart;