// File: src/components/common/Pagination.jsx

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) {
    if (totalItems === 0) return null;

    // Hitung logika matematika di sini
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const showingFrom = indexOfFirstItem + 1;
    const showingTo = Math.min(indexOfLastItem, totalItems);

    return (
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info Text */}
            <span className="text-xs text-slate-500">
                Menampilkan <span className="font-semibold text-slate-700">{showingFrom}</span> - <span className="font-semibold text-slate-700">{showingTo}</span> dari <span className="font-semibold text-slate-700">{totalItems}</span> data
            </span>

            {/* Buttons Group */}
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;
                        const isActive = currentPage === page;
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-6 h-6 text-xs rounded-md flex items-center justify-center transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}