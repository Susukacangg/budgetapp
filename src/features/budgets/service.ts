import type { BudgetEnvelope } from './model.ts'

export type BudgetRepository = {
  listForPeriod(year: number, month: number): Promise<readonly BudgetEnvelope[]>
}

export type BudgetService = {
  listForPeriod(year: number, month: number): Promise<readonly BudgetEnvelope[]>
}

export function createBudgetService(
  repository: BudgetRepository,
): BudgetService {
  return {
    listForPeriod: (year, month) => repository.listForPeriod(year, month),
  }
}
