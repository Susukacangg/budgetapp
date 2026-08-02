import type { Money } from '../../domain/money'

export type AccountType = 'Cash' | 'Bank' | 'Credit Card' | 'E-Wallet'

export type Account = {
  readonly id: string
  readonly name: string
  readonly type: AccountType
  readonly openingBalance: Money
  readonly version: number
}

export type CreateAccountInput = {
  readonly name: string
  readonly type: AccountType
  readonly openingBalance: Money
  readonly idempotencyKey: string
}
