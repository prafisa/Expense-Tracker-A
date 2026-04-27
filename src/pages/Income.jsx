import { useState, useEffect } from "react"
import axios from "axios"
import IncomeSummary from "../components/Income/IncomeSummary"
import IncomeFilters from "../components/Income/IncomeFilters"
import IncomeTable from "../components/Income/IncomeTable"
import Pagination from "../components/shared/Pagination"
import ItemModal from "../components/shared/ItemModal"

const api = axios.create({ baseURL: "https://localhost:7204/api" })
const ITEMS_PER_PAGE = 5

const EMPTY_FILTERS = { search: "", category: "", source: "", dateFrom: "", dateTo: "" }

function shapeIncome(i) {
  return {
    id:         i.id,
    name:       i.source,
    date:       i.date,
    source:     i.method,
    amount:     i.amount,
    categoryId: i.categoryId,
    category: {
      name:  i.categoryName,
      icon:  i.categoryIcon,
      color: i.categoryColor,
    }
  }
}

export default function Income() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories]     = useState([])
  const [filters, setFilters]           = useState(EMPTY_FILTERS)
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [currentPage, setCurrentPage]   = useState(1)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/income"),
      api.get("/category"),
    ]).then(([incomeRes, categoryRes]) => {
      setTransactions(incomeRes.data.map(shapeIncome))
      const incomeOnly = categoryRes.data
        .filter(c => c.type === "INCOME" || c.type === 1)
        .map(c => ({ id: c.id, name: c.name, icon: c.icon, color: c.color, type: "income" }))
      setCategories(incomeOnly)
      setLoading(false)
    })
  }, [])

  // Apply filters
  const filtered = transactions.filter(t => {
    if (filters.search   && !t.name?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && t.category?.name !== filters.category) return false
    if (filters.source   && t.source !== filters.source) return false
    if (filters.dateFrom && t.date?.slice(0,10) < filters.dateFrom) return false
    if (filters.dateTo   && t.date?.slice(0,10) > filters.dateTo)   return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSave = async (formData) => {
    const payload = {
      source:     formData.title,
      method:     formData.method,
      amount:     formData.amount,
      categoryId: formData.categoryId,
      date:       formData.date,
    }
    const { data: created } = await api.post("/income", payload)
    setTransactions(prev => [shapeIncome(created), ...prev])
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income entry?")) return
    await api.delete(`/income/${id}`)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-1">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Incomes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add Income
        </button>
      </div>

      <IncomeSummary transactions={filtered} />

      <IncomeFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={() => { setFilters(EMPTY_FILTERS); setCurrentPage(1) }}
      />

      <IncomeTable
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

      <ItemModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        lockedType="income"
        categories={categories}
      />

    </div>
  )
}