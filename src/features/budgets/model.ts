import type { Money } from '../../domain/money/index.ts'

export type BudgetPeriod = {
  readonly year: number
  readonly month: number
}

export type BudgetEnvelope = {
  readonly id: string
  readonly categoryId: string
  readonly period: BudgetPeriod
  readonly allocated: Money
  readonly version: number
}
