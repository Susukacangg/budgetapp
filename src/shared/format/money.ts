import {
  HOME_CURRENCY_DISPLAY,
  moneyToDecimalString,
  type Money,
} from '../../domain/money'

/** Display-only MYR formatting — no binary float conversion. */
export function formatMoney(value: Money): string {
  return `${HOME_CURRENCY_DISPLAY} ${moneyToDecimalString(value)}`
}
