/**
 * Currency Formatting Utility
 * Formats amounts based on currency settings from the API
 */

interface CurrencySettings {
  symbol: string
  code: string
  position: 'before' | 'after'
  thousand_separator: string
  decimal_separator: string
  decimal_places: number
}

// Default currency settings (Nigerian Naira)
let currencySettings: CurrencySettings = {
  symbol: '₦',
  code: 'NGN',
  position: 'before',
  thousand_separator: ',',
  decimal_separator: '.',
  decimal_places: 2,
}

/**
 * Initialize currency settings from API response
 */
export function initCurrency(settings: CurrencySettings) {
  currencySettings = settings
}

/**
 * Get current currency settings
 */
export function getCurrencySettings(): CurrencySettings {
  return currencySettings
}

/**
 * Format number with thousand and decimal separators
 */
function formatNumber(
  amount: number,
  decimalPlaces: number,
  thousandSeparator: string,
  decimalSeparator: string
): string {
  // Handle negative numbers
  const isNegative = amount < 0
  const absAmount = Math.abs(amount)

  // Split into integer and decimal parts
  const [integerPart, decimalPart = ''] = absAmount.toFixed(decimalPlaces).split('.')

  // Add thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

  // Combine parts
  let result = formattedInteger
  if (decimalPlaces > 0) {
    result += decimalSeparator + decimalPart
  }

  return isNegative ? `-${result}` : result
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number | string, showSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return showSymbol ? `${currencySettings.symbol}0` : '0'
  }

  const formattedAmount = formatNumber(
    numAmount,
    currencySettings.decimal_places,
    currencySettings.thousand_separator,
    currencySettings.decimal_separator
  )

  if (!showSymbol) {
    return formattedAmount
  }

  return currencySettings.position === 'before'
    ? `${currencySettings.symbol}${formattedAmount}`
    : `${formattedAmount}${currencySettings.symbol}`
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(): string {
  return currencySettings.symbol
}

/**
 * Get currency code
 */
export function getCurrencyCode(): string {
  return currencySettings.code
}

/**
 * Format amount without symbol
 */
export function formatAmount(amount: number | string): string {
  return formatCurrency(amount, false)
}

/**
 * Parse formatted currency string to number
 */
export function parseCurrency(formattedAmount: string): number {
  // Remove currency symbol and spaces
  let cleaned = formattedAmount.replace(currencySettings.symbol, '').trim()

  // Replace thousand separators
  cleaned = cleaned.replace(new RegExp(`\\${currencySettings.thousand_separator}`, 'g'), '')

  // Replace decimal separator with standard dot
  cleaned = cleaned.replace(currencySettings.decimal_separator, '.')

  return parseFloat(cleaned) || 0
}
