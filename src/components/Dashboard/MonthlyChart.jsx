import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from 'react'

const MonthlyChart = ({ data = [] }) => {
    // take only last 6 months
    const chartData = data.slice(-6);
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-5">
                <p className="text-sm font-medium text-gray-700">
                    Monthly income vs expenses
                </p>
                <span className="text-xs text-gray-400">Last 6 months</span>
            </div>

            <div className="flex gap-4 mb-4 mb-5" >
                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span>
                    Income
                </span>

                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>
                    Expense
                </span>
            </div>

            {chartData.length === 0 ? (
                <div className="h-52 flex items-center justify-center">
                    <p className="text-gray-300 text-sm">No data available</p>
                </div>
            ) : (
                //barchart
                // make the chart reponsive */}
                <ResponsiveContainer width="100%" height={290}>
                    <BarChart data={chartData}>
                        {/* add grid lines behind the chart */}
                        {/* strokeDasharray : dashed lines */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ceb9b9" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            // convert "2026-04" to "Apr"
                            tickFormatter={(val) => {
                                const [year, month] = val.split("-");
                                return new Date(year, month - 1)
                                    .toLocaleString("en-US", { month: "short" });
                            }}
                        />
                        <YAxis
                            tickFormatter={(v) => `Rs.${Math.round(v / 1000)}k`}
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        {/* shows popup when hover over bars */}
                        <Tooltip
                            formatter={(v, name) => [`Rs.${v.toLocaleString()}`, name]}
                            labelFormatter={(label) => {
                                const [year, month] = label.split("-");
                                return new Date(year, month - 1)
                                    .toLocaleString("en-US", { month: "long", year: "numeric" });
                            }}
                        />                        {/* draw income bars */}
                        <Bar dataKey="income" fill="#4fbd67" radius={[4, 4, 0, 0]} name="Income"/>
                        {/* draw expense bars */}
                        <Bar dataKey="expense" fill="#E24B4A" radius={[4, 4, 0, 0]} name="Expense" />

                    </BarChart>

                </ResponsiveContainer>
            )}
        </div>
    )
}

export default MonthlyChart