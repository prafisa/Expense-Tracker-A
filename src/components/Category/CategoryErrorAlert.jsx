import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const CategoryErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
      <AlertCircle size={16} />
      {error}
      <button onClick={onClose} className="ml-auto">
        <X size={14} />
      </button>
    </div>
  );
};

export default CategoryErrorAlert;