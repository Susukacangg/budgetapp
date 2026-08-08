import {AppForm} from '../../../shared/ui/'

export function AccountsForm() {
    return (
        <AppForm>
            <label htmlFor="account_name">
                Account Name
            </label>
            <input type="text" name="account_name"/>

            <label htmlFor="account_name">
                Account Balance
            </label>
            <input type="text" name="account_balance"/>

            <label htmlFor="account_name">
                Account Type
            </label>
            <input type="text" name="account_type"/>

            <label htmlFor="account_name">
                Description
            </label>
            <input type="text" name="account_desc"/>
        </AppForm>
    )
}
