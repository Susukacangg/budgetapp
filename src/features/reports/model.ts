import type { Money } from '../../domain/money/index.ts'

export type PeriodSummary = {
  readonly year: number
  readonly month: number
  readonly currencyCode: string
  readonly incomeTotal: Money
  readonly expenseTotal: Money
}
