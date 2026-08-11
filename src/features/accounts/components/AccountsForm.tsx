import {type FormEvent} from 'react'
import {AppForm} from '../../../shared/ui/'

type AccountsFormProps = {
    onSubmitHandler: (event: FormEvent<HTMLFormElement>) => void
}

export function AccountsForm({onSubmitHandler}: AccountsFormProps) {
    return (
        <AppForm onSubmitHandler={onSubmitHandler}>
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

            <input type="submit"/>
        </AppForm>
    )
}
