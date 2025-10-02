// ============= Currency Utilities =============
// Formatting and conversion utilities for Guatemalan Quetzales

export const GTQ_CURRENCY = {
  code: 'GTQ',
  symbol: 'Q',
  name: 'Quetzal Guatemalteco',
  locale: 'es-GT'
};

export function formatPrice(amount: number | string, options?: {
  showSymbol?: boolean;
  showDecimals?: boolean;
}): string {
  const { showSymbol = true, showDecimals = true } = options || {};
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Validar que es un número válido
  if (isNaN(numericAmount)) {
    console.warn('⚠️ Precio inválido recibido en formatPrice:', amount);
    return showSymbol ? 'Q0.00' : '0.00';
  }
  
  const formatted = new Intl.NumberFormat('es-GT', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: GTQ_CURRENCY.code,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numericAmount);
  
  return formatted;
}

export function formatPriceSimple(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Validar que es un número válido
  if (isNaN(numericAmount)) {
    console.warn('⚠️ Precio inválido recibido:', amount);
    return 'Q0.00';
  }
  
  return `Q${numericAmount.toFixed(2)}`;
}

export function parsePriceFromString(priceString: string): number {
  // Remove currency symbols and parse
  const cleanPrice = priceString.replace(/[Q\s,]/g, '');
  return parseFloat(cleanPrice) || 0;
}

/**
 * Normaliza un precio que puede venir como string o number a un number válido
 * Útil para datos que vienen del backend como string
 */
export function normalizePrice(price: string | number | undefined | null): number {
  if (price === null || price === undefined) return 0;
  
  if (typeof price === 'number') {
    return isNaN(price) ? 0 : price;
  }
  
  if (typeof price === 'string') {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? 0 : numericPrice;
  }
  
  return 0;
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