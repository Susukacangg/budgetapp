import type { PostedTransaction, TransactionDraft } from './model.ts'

export type TransactionRepository = {
  list(): Promise<readonly PostedTransaction[]>
  save(
    transaction: PostedTransaction,
    idempotencyKey: string,
  ): Promise<PostedTransaction>
}

export type TransactionService = {
  list(): Promise<readonly PostedTransaction[]>
  record(draft: TransactionDraft): Promise<PostedTransaction>
}

export function createTransactionService(
  repository: TransactionRepository,
  deps: { nextId: () => string },
): TransactionService {
  return {
    list: () => repository.list(),
    record: async (draft) => {
      if (draft.amount.minorUnits <= 0n) {
        throw new Error('Transaction amount must be positive')
      }
      const posted: PostedTransaction = {
        ...draft,
        id: deps.nextId(),
        journalEntryId: deps.nextId(),
      }
      return repository.save(posted, draft.idempotencyKey)
    },
  }
}
