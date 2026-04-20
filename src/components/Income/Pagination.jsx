const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-400">
        Showing {start}–{end} of {totalItems} transactions
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-xs px-3 py-2 border rounded-lg ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;