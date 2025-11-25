import { FileDown } from 'lucide-react';
import { downloadTripPdf } from '../../utils/pdf.js';

const PdfExportButton = ({ trip, expenses, settlement }) => {
  const handleDownload = async () => {
    await downloadTripPdf({ trip, expenses, settlement });
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand bg-white py-3 text-sm font-semibold text-brand shadow-sm transition hover:bg-brand/10 dark:bg-transparent"
    >
      <FileDown size={18} />
      Export PDF
    </button>
  );
};

export default PdfExportButton;

