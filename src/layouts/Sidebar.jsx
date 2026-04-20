import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Tag,
  Wallet,
  X,
} from 'lucide-react'

const links = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/categories',   label: 'Categories',   icon: Tag },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/income',       label: 'Income',       icon: TrendingUp },
  { to: '/expenses',     label: 'Expenses',     icon: TrendingDown },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`
        fixed z-30 inset-y-0 left-0 w-60 bg-white border-r border-zinc-200
        flex flex-col transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Wallet size={15} className="text-white" />
          </div>
          <span className="font-semibold text-zinc-800 tracking-tight">Spendly</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-zinc-400 hover:text-zinc-600"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-violet-50 text-violet-700'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-zinc-200 shrink-0">
        <p className="text-xs text-zinc-400">Spendly v1.0</p>
      </div>
    </aside>
  )
}