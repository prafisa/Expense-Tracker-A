// constants.js
export const INITIAL_BUDGETS = [
  { id: 1, category: 'Food & Dining', allocated: 300, categoryId: 3 },
  { id: 2, category: 'Transport', allocated: 120, categoryId: 4 },
  { id: 3, category: 'Health', allocated: 200, categoryId: 5 },
  { id: 4, category: 'Utilities', allocated: 150, categoryId: 6 },
  { id: 5, category: 'Shopping', allocated: 200, categoryId: 7 },
  { id: 6, category: 'Entertainment', allocated: 100, categoryId: 8 },
  { id: 7, category: 'Education', allocated: 150, categoryId: 11 },
]

export const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transport', 'Health', 'Utilities',
  'Shopping', 'Entertainment', 'Education', 'Insurance',
  'Rent', 'Subscriptions', 'Personal Care', 'Miscellaneous',
]

export const colorMap = {
  emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', icon: 'text-emerald-500' },
  amber: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700', icon: 'text-amber-500' },
  rose: { bar: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700', icon: 'text-rose-500' },
}