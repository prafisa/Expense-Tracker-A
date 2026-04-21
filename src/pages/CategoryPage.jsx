import { useState } from "react";
import { Search, Plus } from "lucide-react";

import CategoryStatCards   from "../components/Category/CategoryStatCards";
import CategoryFilters     from "../components/Category/CategoryFilters";
import CategoryGrid        from "../components/Category/CategoryGrid";
import CategoryFormModal   from "../components/Category/CategoryFormModal";
import DeleteCategoryModal from "../components/Category/DeleteCategoryModal";

import { categories as initialCategories } from "../data/categories";

export default function CategoriesPage() {
  // ── Modal visibility state ──────────────────────────────────────────────
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // The category currently being edited or deleted
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const closeAll = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* Main content */}
      <main className="flex-1 min-w-0 px-1 py-1 flex flex-col gap-4">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[20px] font-medium text-gray-900">Categories</h1>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-1.5 h-8 border border-gray-200 rounded-lg px-2.5 bg-gray-50 min-w-37.5">
              <Search size={14} className="text-gray-400 shrink-0" />
              <span className="text-[13px] text-gray-400">Search categories...</span>
            </div>

            {/* Add button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus size={13} />
              Add category
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <CategoryStatCards />

        {/* Filters — static UI only, no active state wired */}
        <CategoryFilters />

        {/* Category grid */}
        <CategoryGrid
          categories={initialCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Add modal ── */}
      {showAddModal && (
        <CategoryFormModal
          mode="add"
          selectedIcon="utensils"
          selectedColor="#E24B4A"
          onClose={closeAll}
          onSubmit={closeAll}
        />
      )}

      {/* ── Edit modal ── */}
      {showEditModal && selectedCategory && (
        <CategoryFormModal
          mode="edit"
          category={selectedCategory}
          selectedIcon={selectedCategory.icon}
          selectedColor={selectedCategory.color}
          onClose={closeAll}
          onSubmit={closeAll}
        />
      )}

      {/* ── Delete modal ── */}
      {showDeleteModal && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          onClose={closeAll}
          onConfirm={closeAll}
        />
      )}
    </div>
  );
}
