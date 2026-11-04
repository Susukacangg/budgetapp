import type {Account} from "../model.ts";

export interface AccountFacade {
    createNewAccount(newAcc: Account): Promise<Account>
    readAllAccounts(): Promise<Account[]>
}