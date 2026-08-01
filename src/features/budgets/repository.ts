import type { BudgetRepository } from './service.ts'

export function createInMemoryBudgetRepository(): BudgetRepository {
  return {
    listForPeriod: async () => [],
  }
}
