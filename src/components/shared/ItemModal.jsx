import { useState, useEffect } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
// import { categories } from '../../data/mockData'
import ModalField from './ModalField'
import CategoryPicker from './CategoryPicker'

const today = new Date().toISOString().split('T')[0]

function makeEmpty(lockedType) {
  return {
    title:      '',
    amount:     '',
    type:       lockedType ?? 'expense',
    categoryId: '',
    date:       today,
    note:       '',
  }
}

// ── input style helper ────────────────────────────────────────────────────────

function inputClass(hasError) {
  return [
    'w-full px-3 py-2.5 rounded-xl border text-sm text-zinc-800',
    'outline-none transition-colors placeholder:text-zinc-300',
    hasError
      ? 'border-rose-300 bg-rose-50 focus:border-rose-400'
      : 'border-zinc-200 bg-zinc-50 focus:border-violet-400 focus:bg-white',
  ].join(' ')
}

// ── main component ────────────────────────────────────────────────────────────

export default function ItemModal({ open, onClose, onSave, editData, lockedType = null, categories= [] }) {
  const [form, setForm]     = useState(makeEmpty(lockedType))
  const [errors, setErrors] = useState({})

  // ── sync form when modal opens ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    if (editData) {
      setForm({ ...editData, amount: String(editData.amount) })
    } else {
      setForm(makeEmpty(lockedType))
    }
    setErrors({})
  }, [open, editData])

  // ── derived ─────────────────────────────────────────────────────────────────
  const filteredCats = categories.filter(c => c.type === form.type)
  const isEdit       = !!editData
  const isIncome     = form.type === 'income'

  const modalTitle = `${isEdit ? 'Edit' : 'Add'} ${
    lockedType === 'income'  ? 'Income'  :
    lockedType === 'expense' ? 'Expense' :
    'Transaction'
  }`

  const submitLabel = isEdit ? 'Save Changes' : `Add ${
    lockedType === 'income'  ? 'Income'  :
    lockedType === 'expense' ? 'Expense' :
    'Transaction'
  }`

  const submitBtnClass = isIncome
    ? 'bg-emerald-500 hover:bg-emerald-600'
    : 'bg-violet-600 hover:bg-violet-700'

  // ── field setter ─────────────────────────────────────────────────────────────
  function setField(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // reset category when type changes
      if (field === 'type') next.categoryId = ''
      return next
    })
    // clear that field's error
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  // ── validation ───────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!form.title.trim())           e.title      = 'Title is required'
    if (!form.amount || +form.amount <= 0) e.amount = 'Enter a valid amount'
    if (!form.categoryId)             e.categoryId = 'Pick a category'
    if (!form.date)                   e.date       = 'Date is required'
    return e
  }

  // ── submit ───────────────────────────────────────────────────────────────────
  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    onSave({
      ...form,
      amount:     +form.amount,
      categoryId: +form.categoryId,
    })
    onClose()
  }

  // ── don't render if closed ───────────────────────────────────────────────────
  if (!open) return null

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-base font-semibold text-zinc-800">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

          {/* Type toggle — only when not locked */}
          {!lockedType && (
            <div className="flex rounded-xl bg-zinc-100 p-1 gap-1">
              {['expense', 'income'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setField('type', t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                    ${form.type === t
                      ? t === 'income'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'bg-white text-rose-500 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                >
                  {t === 'income'
                    ? <TrendingUp size={14} />
                    : <TrendingDown size={14} />
                  }
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <ModalField label={lockedType === 'income' ? 'Source' : 'Title'} error={errors.title}>
            <input
              type="text"
              placeholder={lockedType === 'income' ? 'e.g. Monthly salary' : 'e.g. Grocery shopping'}
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              className={inputClass(errors.title)}
            />
          </ModalField>

          {/* Amount */}
          <ModalField label="Amount (Rs.)" error={errors.amount}>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={e => setField('amount', e.target.value)}
              className={inputClass(errors.amount)}
            />
          </ModalField>

          {/* Category picker */}
          <CategoryPicker
            categories={filteredCats}
            selected={form.categoryId}
            onChange={val => setField('categoryId', val)}
            error={errors.categoryId}
          />

          {/* Date + Note */}
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={e => setField('date', e.target.value)}
                className={inputClass(errors.date)}
              />
            </ModalField>
            <ModalField label="Note (optional)">
              <input
                type="text"
                placeholder="Optional"
                value={form.note}
                onChange={e => setField('note', e.target.value)}
                className={inputClass(false)}
              />
            </ModalField>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${submitBtnClass}`}
          >
            {submitLabel}
          </button>
        </div>

      </div>
    </div>
  )
}