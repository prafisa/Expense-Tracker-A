import React, { useEffect } from 'react';
import BudgetForm from './BudgetForm';

const BudgetModal = ({ isOpen, onClose, onSubmit, initialData, selectedMonth, title }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <BudgetForm
            onSubmit={async (data) => {
              await onSubmit(data);
              onClose();
            }}
            initialData={initialData}
            selectedMonth={selectedMonth}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;