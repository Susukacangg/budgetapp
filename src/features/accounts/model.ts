import type { Money } from '../../domain/money'

export type AccountType = 'Cash' | 'Bank' | 'Credit Card' | 'E-Wallet'

export type AccountDao = {
  readonly id: number
  readonly account_name: string
  readonly account_type: AccountType
  readonly account_balance: number
  readonly account_desc?: string
  readonly created_at: string
}

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

export function convertAccountFromDao(accountDao: AccountDao): Account {
  return {
    id: accountDao.id,
    name: accountDao.account_name,
    type:accountDao.account_type,
    balance:accountDao.account_balance,
    accountDesc:accountDao.account_desc,
    createdAt:accountDao.created_at
  }
}

export function convertAccountsFromDao(accounts: AccountDao[]): Account[] {
  return accounts.map(convertAccountFromDao);
}