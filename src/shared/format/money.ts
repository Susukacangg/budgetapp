import {
  moneyToDecimalString,
  type Money,
} from '../../domain/money/index.ts'

/**
 * Display-only formatting from minor units — no binary float conversion.
 * Locale-aware currency glyphs can be layered later without changing domain math.
 */
export function formatMoney(value: Money): string {
  return `${value.currencyCode} ${moneyToDecimalString(value)}`
}
