/**
 * Persistence port. Implementations live here; features depend on this interface
 * and pass an idempotency key for every side-effecting write.
 */
export type PersistenceKey = string

export type UnitOfWork = {
  /** Commit multi-statement writes atomically when the adapter supports it. */
  commit(): Promise<void>
  rollback(): Promise<void>
}

export type PersistenceAdapter = {
  begin(): Promise<UnitOfWork>
}
