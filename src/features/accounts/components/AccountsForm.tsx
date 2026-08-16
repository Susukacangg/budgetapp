import {type FormEvent} from 'react'
import {AppForm, CurrencyInput, Spinner} from '../../../shared/ui/'

type AccountsFormProps = {
    onSubmitHandler: (event: FormEvent<HTMLFormElement>) => void
    isLoading: boolean
}

export function AccountsForm({onSubmitHandler, isLoading}: AccountsFormProps) {
    return (
        <AppForm onSubmitHandler={onSubmitHandler}>
            <label htmlFor="account_name">
                Account Name
            </label>
            <input type="text" name="account_name"/>

            <label htmlFor="account_name">
                Account Balance
            </label>
            <CurrencyInput name={"account_balance"}/>

            <label htmlFor="account_name">
                Account Type
            </label>
            <input type="text" name="account_type"/>

            <label htmlFor="account_name">
                Description
            </label>
            <input type="text" name="account_desc"/>

            {isLoading ?
                <Spinner size={2}
                      style={{
                          alignSelf: 'center',
                          marginTop: '5px'
                      }}
                /> :
                <input type="submit"/>}
        </AppForm>
    )
}
