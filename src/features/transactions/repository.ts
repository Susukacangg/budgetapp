import {supabase} from "../../infrastructure/supabase";
import type {TxnLogDao} from "./model.ts";

export async function insert(newTxn: TxnLogDao): Promise<TxnLogDao> {
    const { data, error } = await supabase
        .from('txn_log')
        .insert(newTxn)
        .select()
        .single()
    if (error) {
        throw error
    }
    return data
}

export async function getAllTxnLog(): Promise<TxnLogDao[]> {
    /*const FULL_TXN_QUERY = `
      id,
      created_at,
      txn_note,
      txn_desc,
      txn_amount,
      txn_date_time,
      txn_type,
      txn_category (
        id,
        category_name,
        category_type,
        category_parent
      ),
      txn_account (
        id,
        account_name
      )
    `*/

    const {data, error} = await supabase
        .from('txn_log')
        .select()
    if (error) {
        throw error
    }
    return data;
}