// components/OverallProgress.jsx
import { Target } from 'lucide-react'

export default function OverallProgress({ totalSpent, totalAllocated, overallPct }) {
  const fmt = (n) => `Rs.${n.toLocaleString()}`
  
  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-violet-500" />
          <span className="text-sm font-medium text-zinc-700">Overall budget health</span>
        </div>
        <span className="text-sm font-semibold text-zinc-800">
          {fmt(totalSpent)} <span className="font-normal text-zinc-400">of</span> {fmt(totalAllocated)}
        </span>
      </div>
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            overallPct >= 100 ? 'bg-rose-500' : overallPct >= 80 ? 'bg-amber-400' : 'bg-violet-500'
          }`}
          style={{ width: `${Math.min(overallPct, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-zinc-400">{overallPct.toFixed(1)}% used</span>
        <span className="text-xs text-emerald-600 font-medium">
          {fmt(Math.max(totalAllocated - totalSpent, 0))} remaining
        </span>
      </div>
    </div>
  )
}
