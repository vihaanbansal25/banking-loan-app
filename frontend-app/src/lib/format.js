export function formatMoney(value) {
  if (value === null || value === undefined) return '--';
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
