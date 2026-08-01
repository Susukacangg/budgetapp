import {
  createCryptoIdGenerator,
  createInMemoryAuditWriter,
  createMemoryPersistenceAdapter,
  systemClock,
  type AuditWriter,
  type Clock,
  type IdGenerator,
  type PersistenceAdapter,
} from '../infrastructure/index.ts'

export type AppServices = {
  readonly clock: Clock
  readonly ids: IdGenerator
  readonly audit: AuditWriter
  readonly persistence: PersistenceAdapter
}

export const defaultServices: AppServices = {
  clock: systemClock,
  ids: createCryptoIdGenerator('bud'),
  audit: createInMemoryAuditWriter(),
  persistence: createMemoryPersistenceAdapter(),
}
