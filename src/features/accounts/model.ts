import type { CurrencyCode, Money } from '../../domain/money/index.ts'

export type AccountType = 'cash' | 'bank' | 'credit' | 'savings'

export type Account = {
  readonly id: string
  readonly name: string
  readonly type: AccountType
  readonly currencyCode: CurrencyCode
  readonly openingBalance: Money
  readonly version: number
}

export type CreateAccountInput = {
  readonly name: string
  readonly type: AccountType
  readonly currencyCode: CurrencyCode
  readonly openingBalance: Money
  readonly idempotencyKey: string
}
