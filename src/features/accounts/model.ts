import type { Money } from '../../domain/money'

export type AccountType = 'Cash' | 'Bank' | 'Credit Card' | 'E-Wallet'

export type Account = {
  readonly accountName: string
  readonly accountType: AccountType
  readonly accountBalance: number
  readonly accountDesc?: string
}

export type CreateAccountInput = {
  readonly name: string
  readonly type: AccountType
  readonly openingBalance: Money
  readonly idempotencyKey: string
}
