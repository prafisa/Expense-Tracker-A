// MainPage.jsx (or BudgetDashboard.jsx)
import { useState, useMemo } from 'react'
import { Target, Plus, Wallet, TrendingDown, ShieldCheck, Flame } from 'lucide-react'
import transactions from '../data/transactions.json'
import { INITIAL_BUDGETS, EXPENSE_CATEGORIES } from '../data/constants'
import StatCard from '../components/Budget/StatCard'
import OverallProgress from '../components/Budget/OverallProgress'
import BudgetFilters from '../components/Budget/BudgetFilters'
import BudgetGrid from '../components/Budget/BudgetGrid'
import BudgetModal from '../components/Budget/BudgetModal'

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS)
  const [modal, setModal] = useState(null)
  const [sortBy, setSortBy] = useState('pct')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter] = useState('all')

  const spentMap = useMemo(() => {
    const map = {}
    transactions.transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const key = t.category?.name ?? ''
        map[key] = (map[key] ?? 0) + t.amount
      })
    return map
  }, [])

  const enriched = useMemo(() => {
    return budgets.map(b => ({
      ...b,
      spent: spentMap[b.category] ?? 0,
      pct: b.allocated > 0 ? ((spentMap[b.category] ?? 0) / b.allocated) * 100 : 0,
    }))
  }, [budgets, spentMap])

  const filtered = useMemo(() => {
    let list = [...enriched]
    if (filter === 'over') list = list.filter(b => b.pct >= 100)
    if (filter === 'ok') list = list.filter(b => b.pct < 80)

    list.sort((a, b) => {
      let diff = 0
      if (sortBy === 'pct') diff = a.pct - b.pct
      if (sortBy === 'name') diff = a.category.localeCompare(b.category)
      if (sortBy === 'allocated') diff = a.allocated - b.allocated
      return sortDir === 'asc' ? diff : -diff
    })
    return list
  }, [enriched, filter, sortBy, sortDir])

  const totalAllocated = enriched.reduce((s, b) => s + b.allocated, 0)
  const totalSpent = enriched.reduce((s, b) => s + b.spent, 0)
  const overCount = enriched.filter(b => b.pct >= 100).length
  const onTrackCount = enriched.filter(b => b.pct < 80).length
  const overallPct = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

  function handleSort(field) {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  function handleSave(data) {
    if (data.id) {
      setBudgets(prev => prev.map(b => b.id === data.id ? { ...b, ...data } : b))
    } else {
      setBudgets(prev => [...prev, { ...data, id: Date.now() }])
    }
    setModal(null)
  }

  function handleDelete(id) {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  const fmt = (n) => `Rs.${n.toLocaleString()}`

  return (
    <div className="max-w-4xl mx-auto px-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800">Budget</h1>
          <p className="text-sm text-zinc-400 mt-0.5">April 2026 · Monthly limits</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Budget
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Wallet}
          label="Total Allocated"
          value={fmt(totalAllocated)}
          sub="this month"
          accent="violet"
        />
        <StatCard
          icon={TrendingDown}
          label="Total Spent"
          value={fmt(totalSpent)}
          sub={`${overallPct.toFixed(0)}% of budget`}
          accent="rose"
        />
        <StatCard
          icon={ShieldCheck}
          label="On Track"
          value={`${onTrackCount} / ${enriched.length}`}
          sub="categories"
          accent="emerald"
        />
        <StatCard
          icon={Flame}
          label="Over Budget"
          value={overCount}
          sub={overCount === 0 ? 'Great job!' : 'needs attention'}
          accent="amber"
        />
      </div>

      <OverallProgress totalSpent={totalSpent} totalAllocated={totalAllocated} overallPct={overallPct} />

      <BudgetFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        totalCount={enriched.length}
        overCount={overCount}
        onTrackCount={onTrackCount}
      />

      <BudgetGrid
        budgets={filtered}
        onEdit={setModal}
        onDelete={handleDelete}
      />

      {modal && (
        <BudgetModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}