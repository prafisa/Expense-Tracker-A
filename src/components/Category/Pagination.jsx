const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPages = () => {
    if (totalPages <= 3) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getPages();

  return (
    <div className="flex justify-between items-center mt-4 text-sm">
      
      {/* Left text */}
      <p className="text-gray-400">
        Showing {start}–{end} of {totalItems}
      </p>

      {/* Buttons */}
      <div className="flex gap-1">
        
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50"
        >
          Prev
        </button>

        {/* Pages */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg border ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;