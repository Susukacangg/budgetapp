import type {AccountConverter} from "../../converter/AccountConverter.ts";
import type {Account, AccountDao, AccountType} from "../../model.ts";

export class AccountConverterImpl implements AccountConverter {
    convertToDao(account: Account): AccountDao {
        return {
            account_balance: account.balance,
            account_desc: account.accountDesc,
            account_name: account.name,
            account_type: account.type,
            created_at: account.createdAt,
            id: account.id
        }
    }

    convertToAccount(dao: AccountDao): Account {
        return {
            accountDesc: dao.account_desc,
            balance: dao.account_balance,
            createdAt: dao.created_at,
            id: dao.id,
            name: dao.account_name,
            type: dao.account_type as AccountType
        };
    }

}