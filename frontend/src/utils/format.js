export const formatCurrency = (value = 0, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

export const buildWhatsappMessage = ({ trip, settlement }) => {
  if (!trip) return '';
  const lines = [
    `TripSplit report for ${trip.name}`,
    `Total expense: ${formatCurrency(settlement?.totals?.totalExpense || 0)}`,
    '',
  ];
  (settlement?.transactions || []).forEach((tx) =>
    lines.push(`${tx.from} ➡️ ${tx.to}: ${formatCurrency(tx.amount)}`)
  );
  return encodeURIComponent(lines.join('\n'));
};

