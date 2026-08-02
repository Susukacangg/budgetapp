import type { Money } from '../../domain/money'

export type PeriodSummary = {
  readonly year: number
  readonly month: number
  readonly incomeTotal: Money
  readonly expenseTotal: Money
}
