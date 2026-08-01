/**
 * Local-first stub. Replace with IndexedDB / SQLite / remote API adapter later.
 * Writes must remain idempotent via caller-supplied keys.
 */
export function createMemoryPersistenceAdapter(): import('./types.ts').PersistenceAdapter {
  return {
    begin: async () => ({
      commit: async () => undefined,
      rollback: async () => undefined,
    }),
  }
}

export type {
  PersistenceAdapter,
  PersistenceKey,
  UnitOfWork,
} from './types.ts'
