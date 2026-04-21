// components/categories/CategoryGrid.jsx
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ categories = [], onEdit, onDelete }) {
  if (categories.length === 0) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">No categories found.</p>
        <p className="text-xs mt-1">Try a different filter or add a new category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}