import {z} from 'zod';
import type {CategoryBasic, CategoryType} from "../categories";
import {CATEGORY_TYPES} from "../categories/model.ts";
import type {AccountBasic} from "../accounts";

export type TransactionType = CategoryType
export const TRANSACTION_TYPES = CATEGORY_TYPES

export type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  readonly txnNote: string | null;
  readonly txnDesc: string | null;
  readonly txnAmount: number;
  txnCategory: CategoryBasic;
  txnAccount: AccountBasic;
  readonly txnDateTime: string;
  readonly txnType: string;
}

export type TxnLogDao = {
  readonly id: number,
  readonly created_at: string,
  readonly txn_note: string | null,
  readonly txn_desc: string | null,
  readonly txn_amount: number,
  readonly txn_category: number,
  readonly txn_account: number,
  readonly txn_date_time: string,
  readonly txn_type: string
}

/*
* form related schemas and types
* */
export const insertTxnLogSchema = z.object({
  txn_note: z.string().trim().optional(),
  txn_desc: z.string().trim().optional(),
  txn_amount: z.coerce.number('Transaction amount cannot be empty'),
  txn_category: z.coerce.number().gt(0, 'Please choose a category'),
  txn_account: z.coerce.number('Please choose an account'),
  txn_date_time: z.string().nonempty("Date and time cannot be empty"),
  txn_type: z.string("Please choose a transaction type")
})
