const Pagination = () => {
  const totalItems = 12;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center py-3 flex-wrap gap-3">
      <span className="text-sm text-gray-400">
        Showing 1 – 5 of {totalItems} transactions
      </span>
      <div className="flex items-center gap-1">

        {/* Prev — disabled on page 1 */}
        <button
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-300 cursor-not-allowed"
          disabled
        >
          &#8592; Prev
        </button>

        {/* Page 1 — active */}
        <button className="px-3 py-1.5 text-sm border border-blue-500 rounded-md bg-blue-500 text-white">
          1
        </button>

        {/* Page 2 */}
        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">
          2
        </button>

        {/* Page 3 */}
        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">
          {totalPages}
        </button>

        {/* Next */}
        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">
          Next &#8594;
        </button>

      </div>
    </div>
  );
};

export default Pagination;