import type {Account, AccountDao} from "../model.ts";

export interface AccountConverter {
    convertToDao(account: Account): AccountDao
    convertToAccount(dao: AccountDao): Account
}