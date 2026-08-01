import type { Money } from '../money/index.ts'

/** Direction of a single posting within a balanced journal entry. */
export type PostingSide = 'debit' | 'credit'

export type AccountId = string
export type JournalEntryId = string

/**
 * One leg of a double-entry journal entry.
 * Amount is always positive; side indicates debit vs credit.
 */
export type Posting = {
  readonly accountId: AccountId
  readonly side: PostingSide
  readonly amount: Money
}

/**
 * Immutable journal entry. Invariant: sum(debits) === sum(credits)
 * in the same currency before persistence.
 */
export type JournalEntry = {
  readonly id: JournalEntryId
  readonly occurredAtUtc: string
  readonly description: string
  readonly postings: readonly Posting[]
  readonly correlationId: string
  readonly idempotencyKey: string
}
