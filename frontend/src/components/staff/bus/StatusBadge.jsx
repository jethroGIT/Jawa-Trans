// File: src/components/common/StatusBadge.jsx

export default function StatusBadge({ status }) {
    const normalizedStatus = status ? status.toLowerCase() : '';

    switch (normalizedStatus) {
        case 'aktif':
            return (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    Aktif
                </span>
            );
        case 'perbaikan':
            return (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                    Perbaikan
                </span>
            );
        case 'tidak aktif':
            return (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                    Tidak Aktif
                </span>
            );
        default:
            return (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {status || 'Unknown'}
                </span>
            );
    }
}