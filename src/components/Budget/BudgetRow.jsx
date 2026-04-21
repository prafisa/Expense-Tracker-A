import { Pencil, Trash2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { colorMap } from '../../data/constants'

function statusInfo(pct) {
  if (pct >= 100) return { label: 'Over budget', color: 'rose', Icon: XCircle }
  if (pct >= 80) return { label: 'Near limit', color: 'amber', Icon: AlertCircle }
  return { label: 'On track', color: 'emerald', Icon: CheckCircle2 }
}

const fmt = (n) => `Rs.${n.toLocaleString()}`

export default function BudgetRow({ budget, spent, onEdit, onDelete }) {
  const pct = budget.allocated > 0 ? Math.min((spent / budget.allocated) * 100, 100) : 0
  const over = spent > budget.allocated
  const remain = budget.allocated - spent
  const { label, color, Icon } = statusInfo((spent / budget.allocated) * 100)
  const cls = colorMap[color]

  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-5 hover:border-zinc-200 transition-colors">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-800 text-sm truncate">{budget.category}</p>
          <p className="text-xs text-zinc-400 mt-0.5">
            {fmt(spent)} spent of {fmt(budget.allocated)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls.badge}`}>
            <Icon size={11} />
            {label}
          </span>
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${cls.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-zinc-400">{pct.toFixed(0)}% used</span>
        <span className={`text-xs font-medium ${over ? 'text-rose-600' : 'text-emerald-600'}`}>
          {over ? `${fmt(Math.abs(remain))} over` : `${fmt(remain)} left`}
        </span>
      </div>
    </div>
  )
}