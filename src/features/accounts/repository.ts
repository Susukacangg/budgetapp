import type { Account } from './model.ts'
import { supabase } from '../../infrastructure/supabase'

export type AccountDao = {
  readonly id: number
  readonly account_name: string
  readonly account_type: string
  readonly account_balance: number
  readonly account_desc?: string
  readonly created_at: string
}

export async function insert(newAccount: AccountDao): Promise<AccountDao> {
  const { data, error } = await supabase
      .from('account')
      .insert(newAccount)
      .select()
      .single()
  if (error) {
    throw error
  }
  return data
}

export async function getAllAccounts(): Promise<AccountDao[]> {
  const {data, error} = await supabase
      .from('account')
      .select()
  if (error) {
    throw error
  }
  return data;
}