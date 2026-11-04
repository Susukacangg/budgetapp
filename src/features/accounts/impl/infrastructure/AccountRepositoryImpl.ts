import type {AccountRepository} from "../../infrastructure/AccountRepository.ts";
import {supabase} from "../../../../infrastructure/supabase";
import type {AccountDao} from "../../model.ts";

export class AccountRepositoryImpl implements AccountRepository {
    async insertNewAccount(newAcc: AccountDao): Promise<AccountDao> {
        const { data, error } = await supabase
            .from('account')
            .insert(newAcc)
            .select()
            .single()
        if (error) {
            throw error
        }
        return data
    }

    async getAllAccounts(): Promise<AccountDao[]> {
        const {data, error} = await supabase
            .from('account')
            .select()
        if (error) {
            throw error
        }
        return data;
    }
}