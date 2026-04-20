import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/income':       'Income',
  '/expenses':     'Expenses',
  '/categories':   'Categories',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Spendly'

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 md:px-6 gap-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-zinc-400 hover:text-zinc-600"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-base font-semibold text-zinc-800">{title}</h1>
    </header>
  )
}