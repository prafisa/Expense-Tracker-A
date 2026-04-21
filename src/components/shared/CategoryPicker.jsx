export default function CategoryPicker({ categories, selected, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
        Category
      </label>
      <div className="grid grid-cols-3 gap-2">
        {categories.map(cat => {
          const isSelected = selected === cat.id || selected === String(cat.id)
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all
                ${isSelected
                  ? 'border-violet-400 bg-violet-50 text-violet-700'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
            >
              <span className="text-lg">{cat.icon ?? '📦'}</span>  {/* ← fallback if no icon */}
              <span className="text-center leading-tight">{cat.name}</span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}