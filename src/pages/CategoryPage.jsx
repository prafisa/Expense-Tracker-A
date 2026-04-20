import { useState, useMemo, useEffect } from "react";
import categoriesData from "../data/categories";
import CategorySummary from "../components/Category/CategorySummary";
import CategoryFilters from "../components/Category/CategoryFilters";
import CategoryTable from "../components/Category/CategoryTable";
import Pagination from "../components/Transactions/Pagination";
import CategoryModal from "../components/shared/CategoryModal";   // ← add

const ITEMS_PER_PAGE = 5;

export default function CategoryPage() {
  const [categories, setCategories] = useState(categoriesData);
  const [filters, setFilters] = useState({ search: "", type: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);          // ← add
  const [editData, setEditData] = useState(null);                 // ← add

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "All" || cat.type === filters.type;
      return matchSearch && matchType;
    });
  }, [categories, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?"))
      setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleSave = (formData) => {                              // ← add
    if (editData) {
      setCategories(prev => prev.map(c => c.id === editData.id ? { ...c, ...formData } : c));
    } else {
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories(prev => [...prev, { id: newId, ...formData }]);
    }
  };

  const handleClose = () => {                                     // ← add
    setIsModalOpen(false);
    setEditData(null);
  };

  return (
    <div className="min-h-screen bg-white-50 p-2">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Categories</h1>
        <button
          onClick={() => { setEditData(null); setIsModalOpen(true) }}   // ← add onClick
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add Category
        </button>
      </div>

      <CategorySummary categories={categories} />
      <CategoryFilters filters={filters} setFilters={handleFilterChange} />
      <CategoryTable
        categories={paginated}
        onDelete={handleDelete}
        onEdit={(cat) => { setEditData(cat); setIsModalOpen(true) }}    // ← add onEdit
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <CategoryModal                                              // ← add
        open={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
}