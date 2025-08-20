// ============= Currency Utilities =============
// Formatting and conversion utilities for Guatemalan Quetzales

export const GTQ_CURRENCY = {
  code: 'GTQ',
  symbol: 'Q',
  name: 'Quetzal Guatemalteco',
  locale: 'es-GT'
};

export function formatPrice(amount: number, options?: {
  showSymbol?: boolean;
  showDecimals?: boolean;
}): string {
  const { showSymbol = true, showDecimals = true } = options || {};
  
  const formatted = new Intl.NumberFormat('es-GT', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: GTQ_CURRENCY.code,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  
  return formatted;
}

export function formatPriceSimple(amount: number): string {
  return `Q${amount.toFixed(2)}`;
}

export function parsePriceFromString(priceString: string): number {
  // Remove currency symbols and parse
  const cleanPrice = priceString.replace(/[Q\s,]/g, '');
  return parseFloat(cleanPrice) || 0;
}

export function calculateDiscount(originalPrice: number, salePrice: number): {
  amount: number;
  percentage: number;
} {
  const amount = originalPrice - salePrice;
  const percentage = Math.round((amount / originalPrice) * 100);
  
  return { amount, percentage };
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatPriceSimple(min)} - ${formatPriceSimple(max)}`;
}