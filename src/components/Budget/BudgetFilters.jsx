// components/BudgetFilters.jsx
import { ChevronUp, ChevronDown } from 'lucide-react'

function SortBtn({ field, currentSort, sortDir, onSort, children }) {
  const active = currentSort === field
  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
        active ? 'bg-violet-50 text-violet-700' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
      }`}
    >
      {children}
      {active ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : null}
    </button>
  )
}

export default function BudgetFilters({ filter, setFilter, sortBy, sortDir, onSort, totalCount, overCount, onTrackCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex gap-1.5">
        {[
          { key: 'all', label: `All (${totalCount})` },
          { key: 'over', label: `Over (${overCount})` },
          { key: 'ok', label: `On track (${onTrackCount})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              filter === f.key
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-zinc-400 mr-1">Sort:</span>
        <SortBtn field="pct" currentSort={sortBy} sortDir={sortDir} onSort={onSort}>Usage</SortBtn>
        <SortBtn field="name" currentSort={sortBy} sortDir={sortDir} onSort={onSort}>Name</SortBtn>
        <SortBtn field="allocated" currentSort={sortBy} sortDir={sortDir} onSort={onSort}>Limit</SortBtn>
      </div>
    </div>
  )
}