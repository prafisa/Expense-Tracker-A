import { useState, useEffect } from "react"
import axios from "axios"
import TransactionSummary from "../components/Transactions/TransactionSummary"
import TransactionFilters from "../components/Transactions/TransactionFilters"
import TransactionTable from "../components/Transactions/TransactionTable"
import Pagination from "../components/shared/Pagination"

const api = axios.create({ baseURL: "https://localhost:7204/api" })
const ITEMS_PER_PAGE = 5

const EMPTY_FILTERS = { search: "", category: "", source: "", type: "", dateFrom: "", dateTo: "" }

function shapeTransaction(t) {
  return {
    id:       t.id,
    name:     t.name,
    date:     t.date,
    source:   t.method,
    amount:   t.amount,
    type:     t.type,
    categoryId: t.categoryId,
    category: {
      name:  t.categoryName,
      icon:  t.categoryIcon,
      color: t.categoryColor,
    }
  }
}

export default function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories]     = useState([])
  const [filters, setFilters]           = useState(EMPTY_FILTERS)
  const [currentPage, setCurrentPage]   = useState(1)
  const [loading, setLoading]           = useState(true)
  const [summary, setSummary]           = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  })

  useEffect(() => {
    Promise.all([
      api.get("/transaction"),
      api.get("/category"),
    ]).then(([txnRes, categoryRes]) => {
      const shaped = (txnRes.data.transactions ?? []).map(shapeTransaction)
      setTransactions(shaped)
      setSummary({
        totalIncome:      txnRes.data.totalIncome ?? 0,
        totalExpense:     txnRes.data.totalExpense ?? 0,
        balance:          txnRes.data.balance ?? 0,
        transactionCount: txnRes.data.transactionCount ?? 0,
      })
      setCategories(categoryRes.data.map(c => ({
        id:    c.id,
        name:  c.name,
        icon:  c.icon,
        color: c.color,
        type:  c.type,
      })))
      setLoading(false)
    })
  }, [])

  // Apply filters client-side
  const filtered = transactions.filter(t => {
    if (filters.search   && !t.name?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && t.category?.name !== filters.category) return false
    if (filters.source   && t.source !== filters.source)           return false
    if (filters.type     && t.type !== filters.type)               return false
    if (filters.dateFrom && t.date?.slice(0, 10) < filters.dateFrom) return false
    if (filters.dateTo   && t.date?.slice(0, 10) > filters.dateTo)   return false
    return true
  })

  // Recalculate summary from filtered list
  const filteredSummary = {
    totalIncome:      filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
    totalExpense:     filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    balance:          filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0)
                    - filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    transactionCount: filtered.length,
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDelete = async (id, txnType) => {
    if (!window.confirm("Delete this transaction?")) return
    const endpoint = txnType === "INCOME" ? "income" : "expense"
    await api.delete(`/${endpoint}/${id}`)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-1">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Transactions</h1>
      </div>

      <TransactionSummary summary={filteredSummary} />

      <TransactionFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={() => { setFilters(EMPTY_FILTERS); setCurrentPage(1) }}
      />

      <TransactionTable
        transactions={paginated}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

    </div>
  )
}