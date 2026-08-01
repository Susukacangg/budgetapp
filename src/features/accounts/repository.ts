import type { Account } from './model.ts'
import type { AccountRepository } from './service.ts'

/** In-memory repository with idempotency-key deduplication. */
export function createInMemoryAccountRepository(): AccountRepository {
  const byId = new Map<string, Account>()
  const byIdempotencyKey = new Map<string, Account>()

  return {
    list: async () => [...byId.values()],
    getById: async (id) => byId.get(id) ?? null,
    save: async (account, idempotencyKey) => {
      const existing = byIdempotencyKey.get(idempotencyKey)
      if (existing) {
        return existing
      }
      const frozen = Object.freeze({ ...account })
      byId.set(frozen.id, frozen)
      byIdempotencyKey.set(idempotencyKey, frozen)
      return frozen
    },
  }
}
