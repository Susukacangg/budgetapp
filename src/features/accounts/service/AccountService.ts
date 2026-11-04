import type {Account} from "../model.ts";

export interface AccountService {
    insertNewAccount(newAcc: Account): Promise<Account>
    getAllAccounts(): Promise<Account[]>
}