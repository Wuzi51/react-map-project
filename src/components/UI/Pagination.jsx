const Pagination = ({ 
  current = 1, 
  total = 0, 
  pageSize = 10, 
  onChange
}) => {
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5; // 顯示的頁面數量
    
    let startPage = Math.max(1, current - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // 第一頁
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // 中間頁面
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 border rounded ${
            i === current
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // 最後一頁
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* 上一頁 */}
      <button
        onClick={() => handlePageChange(current - 1)}
        disabled={current <= 1}
        className={`px-3 py-2 border rounded ${
          current <= 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        上一頁
      </button>

      {/* 頁碼 */}
      {renderPageNumbers()}

      {/* 下一頁 */}
      <button
        onClick={() => handlePageChange(current + 1)}
        disabled={current >= totalPages}
        className={`px-3 py-2 border rounded ${
          current >= totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        下一頁
      </button>
    </div>
  );
};

export default Pagination;