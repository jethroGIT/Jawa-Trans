import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';

export default function TiketActions({ children, fileName = 'Tiket' }) {
    const navigate = useNavigate();
    const componentRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Konfigurasi untuk PRINT
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: fileName,
        pageStyle: `
            @page { size: A4; margin: 15mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
        `,
        onAfterPrint: () => console.log('Print selesai')
    });

    // Handler DOWNLOAD PDF
    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;
        setIsDownloading(true);
        try {
            const element = componentRef.current;
            const opt = {
                margin: 10,
                filename: `${fileName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengunduh PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            {/* Toolbar Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
                
                {/* 1. Tombol Kembali (Updated Style) 
                    - Menggunakan style 'border-2' agar tingginya sama dengan tombol Unduh
                    - Warna abu-abu (Gray) agar terlihat sebagai navigasi sekunder
                */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 rounded-lg transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                </button>

                {/* 2. Group Tombol Print & Download */}
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Printer className="w-5 h-5" />
                        Cetak Tiket
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Download className="w-5 h-5" />
                        {isDownloading ? 'Mengunduh...' : 'Unduh PDF'}
                    </button>
                </div>
            </div>

            {/* Loading Indicator */}
            {isDownloading && (
                <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 text-center print:hidden">
                    <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sedang membuat PDF...</span>
                    </div>
                </div>
            )}

            {/* Konten Tiket */}
            <div ref={componentRef}>
                {children}
            </div>
        </>
    );
}