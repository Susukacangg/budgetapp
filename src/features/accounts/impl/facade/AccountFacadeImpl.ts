import type {AccountFacade} from "../../facade/AccountFacade.ts";
import type {Account} from "../../model.ts";
import type {AccountService} from "../../service/AccountService.ts";
import {AccountServiceImpl} from "../service/AccountServiceImpl.ts";

export class AccountFacadeImpl implements AccountFacade {
    private service: AccountService = new AccountServiceImpl()

    createNewAccount(newAcc: Account): Promise<Account> {
        return this.service.insertNewAccount(newAcc);
    }

    readAllAccounts(): Promise<Account[]> {
        return this.service.getAllAccounts();
    }

}