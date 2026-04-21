import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../../data/constants'

export default function BudgetModal({ initial, onSave, onClose }) {
  const [category, setCategory] = useState(initial?.category ?? '')
  const [allocated, setAllocated] = useState(initial?.allocated ?? '')
  const isEdit = !!initial?.id

  function handleSubmit(e) {
    e.preventDefault()
    if (!category || !allocated || Number(allocated) <= 0) return
    onSave({ id: initial?.id, category, allocated: Number(allocated), categoryId: initial?.categoryId ?? null })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm mx-4 p-6 border border-zinc-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-800">
            {isEdit ? 'Edit Budget' : 'New Budget'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <XCircle size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Category</label>
            {isEdit ? (
              <div className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700">
                {category}
              </div>
            ) : (
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select a category…</option>
                {EXPENSE_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Monthly limit (Rs.)</label>
            <input
              type="number"
              min="1"
              value={allocated}
              onChange={e => setAllocated(e.target.value)}
              required
              placeholder="e.g. 300"
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              {isEdit ? 'Update' : 'Add Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}