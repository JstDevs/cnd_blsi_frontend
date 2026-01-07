export const formatCurrency = (value) =>
  value !== null && value !== undefined && value !== ''
    ? Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : '—';

export const formatCurrencyWithoutDecimal = (value) =>
  value !== null && value !== undefined && value !== ''
    ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 0 })
    : '—';

export const formatForInput = (value) => {
  if (value === null || value === undefined || value === '') return '';

  const stringValue = value.toString();
  const [integerPart, decimalPart] = stringValue.split('.');

  // Format integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Return formatted integer + decimal part (if it exists)
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
