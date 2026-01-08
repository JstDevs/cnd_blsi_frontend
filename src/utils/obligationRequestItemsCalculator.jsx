export function obligationRequestItemsCalculator({
  price = '',
  quantity = '',
  taxRate = 0,
  discountPercent = 0,
  vatable = false,
  ewtRate = 0,
  vatRate = 12,
}) {
  const p = parseFloat(price) || 0;
  const q = parseFloat(quantity) || 0;
  const taxPercent = parseFloat(taxRate) || 0;
  const discPct = (parseFloat(discountPercent) || 0) / 100;
  const ewtPercent = parseFloat(ewtRate) || 0;

  const grossAmount = p * q;
  const discount = +(grossAmount * discPct).toFixed(2);
  const netBeforeTax = grossAmount - discount;

  let vat = 0;
  let taxBase = netBeforeTax;

  if (vatable) {
    // If vatable, we assume price is VAT inclusive (standard Philippine practice for OBR)
    // Extract VAT from the inclusive price
    vat = +((netBeforeTax * vatRate) / (100 + vatRate)).toFixed(2);
    taxBase = +(netBeforeTax - vat).toFixed(2);
  } else {
    // If not vatable, VAT is 0. Tax base is simply the net amount.
    vat = 0;
    taxBase = netBeforeTax;
  }

  // Calculate Withholding Taxes (based on taxBase)
  // These are deductions, so they should be negative
  const withheld = +((taxBase * taxPercent) / 100 * -1).toFixed(2);
  const ewt = +((taxBase * ewtPercent) / 100 * -1).toFixed(2);
  const totalDeduction = +(withheld + ewt).toFixed(2);

  // Final subtotal: What is actually being obligated
  // Usually this is Gross - Discount + Deductions(Negative)
  // VAT is included in the base if vatable=true, omitted if vatable=false
  const subtotal = +(netBeforeTax + totalDeduction).toFixed(2);

  return {
    subtotalBeforeDiscount: grossAmount,
    discount,
    vat,
    subtotalTaxIncluded: vatable ? netBeforeTax : +(netBeforeTax + vat).toFixed(2),
    subtotalTaxExcluded: taxBase,
    withheld,
    ewt,
    ewtrate: ewtPercent,
    totalDeduction,
    subtotal,
  };
}
