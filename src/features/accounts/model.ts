import type { Money } from '../../domain/money'

export type AccountType = 'Cash' | 'Bank' | 'Credit Card' | 'E-Wallet'

export type Account = {
  readonly id: number
  readonly name: string
  readonly type: AccountType
  readonly balance: number
  readonly accountDesc?: string
  readonly createdAt: string
}

export type CreateAccountInput = {
  readonly name: string
  readonly type: AccountType
  readonly openingBalance: Money
  readonly idempotencyKey: string
}
