import { useState } from "react"
import IncomeSummary from "../components/Income/IncomeSummary"
import IncomeFilters from "../components/Income/IncomeFilters"
import IncomeTable from "../components/Income/IncomeTable"
import Pagination from "../components/shared/Pagination"   
import incomeData from "../data/income.json"
import ItemModal from "../components/shared/ItemModal"
import categoriesData from "../data/dashboardData.json"

const incomeCategories = [
  { id: 1, name: 'Salary',     icon: '💼', type: 'INCOME' },
  { id: 2, name: 'Freelance',  icon: '💻', type: 'INCOME' },
  { id: 3, name: 'Investment', icon: '📈', type: 'INCOME' },
  { id: 4, name: 'Business',   icon: '🏪', type: 'INCOME' },
  { id: 5, name: 'Other',      icon: '💰', type: 'INCOME' },
]

const ITEMS_PER_PAGE = 5

export default function Income() {
  const [transactions, setTransactions] = useState(incomeData.transactions)
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editData, setEditData]         = useState(null)
  const [currentPage, setCurrentPage]   = useState(1)

  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE))
  const paginated  = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSave = (formData) => {
    if (editData) {
      setTransactions(prev =>
        prev.map(t => t.id === editData.id ? { ...t, ...formData } : t)
      )
    } else {
      const newId = Math.max(...transactions.map(t => t.id)) + 1
      setTransactions(prev => [{ id: newId, ...formData }, ...prev])
    }
    setEditData(null)
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this income entry?"))
      setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-1">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Incomes</h1>
        <button
          onClick={() => { setEditData(null); setIsModalOpen(true) }}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add Income
        </button>
      </div>

      <IncomeSummary transactions={transactions} />
      <IncomeFilters />

      <IncomeTable
        transactions={paginated}
        onEdit={(txn) => { setEditData(txn); setIsModalOpen(true) }}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={transactions.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <ItemModal
  open={isModalOpen}
  onClose={handleClose}
  onSave={handleSave}
  editData={editData}
  lockedType="income"
  categories={incomeCategories}   
/>
    </div>
  )
}