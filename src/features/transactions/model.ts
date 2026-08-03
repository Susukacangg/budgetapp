import type { Money } from '../../domain/money'

export type TransactionKind = 'expense' | 'income' | 'transfer'

export type TransactionDraft = {
  readonly accountId: string
  readonly categoryId: string | null
  readonly kind: TransactionKind
  readonly amount: Money
  readonly occurredAtUtc: string
  readonly memo: string
  readonly idempotencyKey: string
  readonly correlationId: string
}

export type PostedTransaction = TransactionDraft & {
  readonly id: string
  readonly journalEntryId: string
}
