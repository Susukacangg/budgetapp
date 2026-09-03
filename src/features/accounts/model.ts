import { z } from 'zod'
import type { AccountDao } from './repository.ts'

export const ACCOUNT_TYPES = ['Cash', 'Debit Card', 'Credit Card', 'E-Wallet'] as const
export type AccountType = (typeof ACCOUNT_TYPES)[number]

export type Account = {
  readonly id: number
  readonly name: string
  readonly type: AccountType
  readonly balance: number
  readonly accountDesc: string | null
  readonly createdAt: string
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


/*
* form related schemas and types
* */
export const insertAccountSchema = z.object({
  account_name: z.string().trim().min(1, 'Account name is required'),
  account_type: z.enum(ACCOUNT_TYPES),
  account_balance: z.coerce.number().finite('Account balance must be a valid number'),
  account_desc: z.string().trim().optional(),
})