/** ISO 4217 alphabetic currency code (e.g. SGD, USD). */
export type CurrencyCode = string

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/

export function parseCurrencyCode(value: string): CurrencyCode {
  const normalized = value.trim().toUpperCase()
  if (!CURRENCY_CODE_PATTERN.test(normalized)) {
    throw new Error(`Invalid currency code: ${value}`)
  }
  return normalized
}

/** Decimal places for minor units. Defaults cover common ISO currencies. */
export function defaultScaleForCurrency(currencyCode: CurrencyCode): number {
  switch (currencyCode) {
    case 'JPY':
    case 'KRW':
    case 'VND':
      return 0
    case 'BHD':
    case 'KWD':
    case 'OMR':
      return 3
    default:
      return 2
  }
}
