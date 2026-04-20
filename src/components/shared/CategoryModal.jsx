import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import ModalField from './ModalField'        // ← reuse this

function makeEmpty() {
  return { name: '', type: 'Expense', description: '' }
}

function inputClass(hasError) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-300
    ${hasError
      ? 'border-rose-300 bg-rose-50 focus:border-rose-400'
      : 'border-zinc-200 bg-zinc-50 focus:border-violet-400 focus:bg-white'
    }`
}

export default function CategoryModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(makeEmpty())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    if (editData) setForm({ ...editData })
    else setForm(makeEmpty())
    setErrors({})
  }, [open, editData])

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name = 'Name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-800">
            {editData ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Name */}
          <ModalField label="Category Name" error={errors.name}>
            <input
              type="text"
              placeholder="e.g. Groceries"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              className={inputClass(errors.name)}
            />
          </ModalField>

          {/* Type toggle */}
          <ModalField label="Type">
            <div className="flex rounded-xl bg-zinc-100 p-1 gap-1">
              {['Expense', 'Income'].map(t => (
                <button key={t} type="button"
                  onClick={() => setField('type', t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                    ${form.type === t
                      ? t === 'Income'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'bg-white text-rose-500 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </ModalField>

          {/* Description */}
          <ModalField label="Description" error={errors.description}>
            <textarea
              placeholder="e.g. Daily meal expenses"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              rows={3}
              className={inputClass(errors.description)}
            />
          </ModalField>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
            {editData ? 'Save Changes' : 'Add Category'}
          </button>
        </div>

      </div>
    </div>
  )
}