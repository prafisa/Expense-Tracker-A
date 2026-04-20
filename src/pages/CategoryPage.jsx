import { useState, useMemo, useEffect } from "react";
import categoriesData from "../data/categories";
import CategorySummary from "../components/Category/CategorySummary";
import CategoryFilters from "../components/Category/CategoryFilters";
import CategoryTable from "../components/Category/CategoryTable";
import Pagination from "../components/Transactions/Pagination";

const ITEMS_PER_PAGE = 5;

export default function CategoryPage() {
  const [categories, setCategories] = useState(categoriesData);

  const [filters, setFilters] = useState({
    search: "",
    type: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchType =
        filters.type === "All" || cat.type === filters.type;

      return matchSearch && matchType;
    });
  }, [categories, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Keep page valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-white-50 p-2">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">
          Categories
        </h1>

        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">
          + Add Category
        </button>
      </div>

      {/* Summary */}
      <CategorySummary categories={categories} />

      {/* Filters */}
      <CategoryFilters
        filters={filters}
        setFilters={handleFilterChange}
      />

      {/* Table */}
      <CategoryTable
        categories={paginated}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="mt-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
      </div>
    </div>
  );
}