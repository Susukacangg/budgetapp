import type { Account } from './model.ts'
import type { AccountRepository } from './service.ts'
import { supabase } from '../../infrastructure/supabase'

/** In-memory repository with idempotency-key deduplication. */
export function createInMemoryAccountRepository(): AccountRepository {
  const byId = new Map<string, Account>()
  const byIdempotencyKey = new Map<string, Account>()

  return {
    list: async () => [...byId.values()],
    getById: async (id) => byId.get(id) ?? null,
    save: async (account, idempotencyKey) => {
      const existing = byIdempotencyKey.get(idempotencyKey)
      if (existing) {
        return existing
      }
      const frozen = Object.freeze({ ...account })
      byId.set(frozen.id, frozen)
      byIdempotencyKey.set(idempotencyKey, frozen)
      return frozen
    },
  }
}

export async function insert(newAccount: Account): Promise<Account> {
  const { data, error } = await supabase
      .from('account')
      .insert({
        account_name: newAccount.accountName,
        account_type: newAccount.accountType,
        account_balance: newAccount.accountBalance,
        account_desc: newAccount.accountDesc ?? null,
      })
      .select()
      .single()
  if (error) {
    throw error
  }
  return {
    accountName: data.account_name,
    accountType: data.account_type,
    accountBalance: data.account_balance,
    accountDesc: data.account_desc,
  }
}