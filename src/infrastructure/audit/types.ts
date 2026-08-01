export type AuditActor = {
  readonly type: 'user' | 'system'
  readonly id: string
}

/**
 * Append-only audit record for financial / account / user state changes.
 * Never mutate or delete except via documented retention process.
 */
export type AuditEntry = {
  readonly id: string
  readonly actor: AuditActor
  readonly occurredAtUtc: string
  readonly action: string
  readonly entityType: string
  readonly entityId: string
  readonly before: unknown | null
  readonly after: unknown | null
  readonly correlationId: string
  readonly source: string
  readonly reason?: string
}

export type AuditWriter = {
  append(entry: AuditEntry): Promise<void>
}

/** In-memory writer for local development and tests. */
export function createInMemoryAuditWriter(): AuditWriter & {
  entries(): readonly AuditEntry[]
} {
  const entries: AuditEntry[] = []
  return {
    append: async (entry) => {
      entries.push(Object.freeze({ ...entry }))
    },
    entries: () => entries,
  }
}
