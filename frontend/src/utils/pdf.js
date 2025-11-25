import { PDFDocument, StandardFonts } from 'pdf-lib';
import { formatCurrency, formatDate } from './format.js';

export const downloadTripPdf = async ({ trip, expenses = [], settlement }) => {
  if (!trip) throw new Error('No trip selected');

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let cursorY = 800;
  const write = (text = '', size = 12) => {
    if (cursorY < 60) {
      page = pdfDoc.addPage([595, 842]);
      cursorY = 800;
    }
    page.drawText(text, {
      x: 40,
      y: cursorY,
      size,
      font,
    });
    cursorY -= size + 6;
  };

  write(`TripSplit Report – ${trip.name}`, 18);
  write(`Generated on ${new Date().toLocaleString()}`, 10);
  write('');

  write('Summary', 14);
  write(`Total Expense: ${formatCurrency(settlement?.totals?.totalExpense || 0)}`);
  write('');

  write('Expenses', 14);
  expenses.forEach((expense) => {
    write(
      `${formatDate(expense.date)} – ${expense.description}: ${formatCurrency(
        expense.amount
      )}`
    );
  });

  write('');
  write('Settlement', 14);
  (settlement?.transactions || []).forEach((tx) => {
    write(`${tx.from} pays ${tx.to} ${formatCurrency(tx.amount)}`);
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${trip.name}-TripSplit.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

