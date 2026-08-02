import { assertHomeCurrency } from '../../domain/money'
import type { Account, CreateAccountInput } from './model.ts'

export type AccountRepository = {
  list(): Promise<readonly Account[]>
  getById(id: string): Promise<Account | null>
  save(account: Account, idempotencyKey: string): Promise<Account>
}

export type AccountService = {
  create(input: CreateAccountInput): Promise<Account>
  list(): Promise<readonly Account[]>
}

export function createAccountService(
  repository: AccountRepository,
  deps: { nextId: () => string },
): AccountService {
  return {
    list: () => repository.list(),
    create: async (input) => {
      const name = input.name.trim()
      if (!name) {
        throw new Error('Account name is required')
      }
      assertHomeCurrency(input.openingBalance)
      const account: Account = {
        id: deps.nextId(),
        name,
        type: input.type,
        openingBalance: input.openingBalance,
        version: 1,
      }
      return repository.save(account, input.idempotencyKey)
    },
  }
}
