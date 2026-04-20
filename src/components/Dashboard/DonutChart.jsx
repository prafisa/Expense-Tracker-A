import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const DonutChart = ({ data = [] }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-xl p-4'>
      <p className='text-sm font-medium text-gray-700 mb-3'>
        Spending by Category
      </p>

      {/* Legend */}
      <div className='flex flex-wrap gap-2 mb-3'>
        {data.map((item) => (
          <span key={item.name} className='flex items-center gap-1 text-xs text-gray-500'>
            <span
              className='w-3 h-3 rounded-sm inline-block'
              style={{ backgroundColor: item.color }}
            ></span>
            {item.name} {item.value}%
          </span>
        ))}
      </div>

      {/* No ResponsiveContainer — fixed width and height directly on PieChart */}
      <div className='flex justify-center'>
        <PieChart width={220} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            dataKey="value"
          >
            {data.map((item, index) => (
              <Cell key={index} fill={item.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
        </PieChart>
      </div>

    </div>
  )
}

export default DonutChart