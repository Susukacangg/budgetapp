/**
 * Sole supported currency: Malaysian Ringgit.
 * ISO 4217 code is MYR; common display symbol is RM.
 */
export const HOME_CURRENCY = 'MYR' as const
export type CurrencyCode = typeof HOME_CURRENCY

export const HOME_CURRENCY_SCALE = 2
export const HOME_CURRENCY_DISPLAY = 'RM'

/**
 * Accepts MYR or RM at boundaries; always normalizes to MYR.
 * Rejects every other currency — this app is single-currency.
 */
export function parseCurrencyCode(value: string): CurrencyCode {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'MYR' || normalized === 'RM') {
    return HOME_CURRENCY
  }
  throw new Error(
    `Unsupported currency: ${value}. Only MYR (RM) is supported.`,
  )
}
