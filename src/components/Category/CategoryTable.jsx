export default function CategoryTable({ categories, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-4 bg-gray-50 text-gray-500 text-sm font-medium px-6 py-3">
        <div>Category Name</div>
        <div>Type</div>
        <div>Description</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Table Rows */}
      {categories.map((category) => (
        <div
          key={category.id}
          className="grid grid-cols-4 px-6 py-3 border-t border-gray-100 items-center text-sm hover:bg-gray-50"
        >
          {/* Category Name */}
          <div className="font-medium text-gray-800">{category.name}</div>

          {/* Type */}
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.type === "Income"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {category.type}
            </span>
          </div>

          {/* Description */}
          <div className="text-gray-500 truncate">{category.description}</div>

          {/* Actions */}
          <div className="text-center flex items-center justify-center gap-3">
            <button
              onClick={() => onEdit(category)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-400">
          No categories found
        </div>
      )}
    </div>
  );
}
