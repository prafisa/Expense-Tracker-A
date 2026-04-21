// components/categories/DeleteCategoryModal.jsx
import { Trash2, TriangleAlert, X } from "lucide-react";

export default function DeleteCategoryModal({ category, onClose, onConfirm }) {
  if (!category) return null;

  const hasTransactions = category.transactionCount > 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-white border border-gray-100 rounded-xl w-[330px] p-5 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={15} className="text-red-700" />
          <h2 className="text-[14px] font-medium text-gray-900">
            Delete category
          </h2>
        </div>

        {/* Message */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-3">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{category.name}</span>?
          This action cannot be undone.
        </p>

        {/* Warning when linked transactions exist */}
        {hasTransactions && (
          <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            <TriangleAlert size={13} className="text-red-700 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-800 leading-relaxed">
              This category has{" "}
              <span className="font-medium">{category.transactionCount} transaction{category.transactionCount !== 1 ? "s" : ""}</span>.
              Deleting it will leave those transactions uncategorized.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={12} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}