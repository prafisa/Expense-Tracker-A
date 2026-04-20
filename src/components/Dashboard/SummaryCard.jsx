import React from 'react'

const SummaryCard = ({ label, value, change, positive }) => {
    return (
        <div className='bg-gray-100 rounded-xl p-4'>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-medium text-gray-800">{value}</p>
            <p className={`text-xs mt-1 ${positive ? "text-green-600" : "text-red-500"}`}>
                {change}
            </p>
        </div>
    )
}

export default SummaryCard