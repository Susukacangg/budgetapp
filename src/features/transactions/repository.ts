import type { PostedTransaction } from './model.ts'
import type { TransactionRepository } from './service.ts'

export function createInMemoryTransactionRepository(): TransactionRepository {
  const byId = new Map<string, PostedTransaction>()
  const byIdempotencyKey = new Map<string, PostedTransaction>()

  return {
    list: async () => [...byId.values()],
    save: async (transaction, idempotencyKey) => {
      const existing = byIdempotencyKey.get(idempotencyKey)
      if (existing) {
        return existing
      }
      const frozen = Object.freeze({ ...transaction })
      byId.set(frozen.id, frozen)
      byIdempotencyKey.set(idempotencyKey, frozen)
      return frozen
    },
  }
}
