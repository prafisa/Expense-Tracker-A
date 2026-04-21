import { BarChart,Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from 'react'

const MonthlyChart = ({ data }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
                Montly Income vs Expenses
            </p>

            <div className="flex gap-4 mb-3" >
                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                    Income
                </span>

                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>
                    Expense
                </span>
            </div>

            {/* barchart */}
            {/* make the chart reponsive */}
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    {/* add grid lines behind the chart */}
                    {/* strokeDasharray : dashed lines */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ceb9b9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `Rs. ${v / 1000}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    {/* shows popup when hover over bars */}
                    <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                    {/* draw income bars */}
                    <Bar dataKey="income" fill="#378ADD" radius={[4, 4, 0, 0]} />
                    {/* draw expense bars */}
                    <Bar dataKey="expense" fill="#E24B4A" radius={[4, 4, 0, 0]} />

                </BarChart>

            </ResponsiveContainer>

        </div>
    )
}

export default MonthlyChart