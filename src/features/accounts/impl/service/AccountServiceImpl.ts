import type {AccountService} from "../../service/AccountService.ts";
import type {Account, AccountDao} from "../../model.ts";
import type {AccountRepository} from "../../infrastructure/AccountRepository.ts";
import {AccountRepositoryImpl} from "../infrastructure/AccountRepositoryImpl.ts";
import type {AccountConverter} from "../../converter/AccountConverter.ts";
import {AccountConverterImpl} from "../converter/AccountConverterImpl.ts";

export class AccountServiceImpl implements AccountService {
    private repo: AccountRepository = new AccountRepositoryImpl()
    private converter: AccountConverter = new AccountConverterImpl()

    async insertNewAccount(newAcc: Account): Promise<Account> {
        const saved: AccountDao = await this.repo.insertNewAccount(this.converter.convertToDao(newAcc));
        return this.converter.convertToAccount(saved)
    }

    async getAllAccounts(): Promise<Account[]> {
        const retrievedDaos = await this.repo.getAllAccounts()
        return retrievedDaos.map((dao) => this.converter.convertToAccount(dao))
    }
}