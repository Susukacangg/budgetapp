import { z } from 'zod'

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

export type AccountDao = {
  readonly id: number
  readonly account_name: string
  readonly account_type: string
  readonly account_balance: number
  readonly account_desc: string | null
  readonly created_at: string
}

/*
* form related schemas and types
* */
export const AccountInsertSchema = z.object({
  name: z.string().trim().superRefine((val, ctx) => {
    if (val.length < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter account name"
      })
    } else if (val.length < 4) {
      ctx.addIssue({
        code: "custom",
        message: "Account name too short"
      })
    }
  }),
  type: z.string("Please select account type").trim(),
  balance: z.number("Account balance cannot be empty"),
  accountDesc: z.string().trim().nullable(),
})