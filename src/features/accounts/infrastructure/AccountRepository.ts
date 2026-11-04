import type {AccountDao} from "../model.ts";

export interface AccountRepository {
    insertNewAccount(newAcc: AccountDao): Promise<AccountDao>
    getAllAccounts(): Promise<AccountDao[]>
}