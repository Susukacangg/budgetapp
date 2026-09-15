import {type SyntheticEvent} from 'react'
import {AppForm, CurrencyInput, Spinner} from '../../../shared/ui/'
import {ACCOUNT_TYPES} from "../model.ts";

type AccountsFormProps = {
    onSubmitHandler: (event: SyntheticEvent<HTMLFormElement>) => void
    isLoading: boolean
}

export function AccountsForm({onSubmitHandler, isLoading}: Readonly<AccountsFormProps>) {
    return (
        <AppForm onSubmitHandler={onSubmitHandler}>
            <label htmlFor="account_name">
                Account Name
            </label>
            <input type="text" name="account_name" autoComplete="off"/>

            <label htmlFor="account_balance">
                Account Balance
            </label>
            <CurrencyInput name={"account_balance"}/>

            <label htmlFor="account_type">
                Account Type
            </label>
            <select
                name="account_type"
                id="account_type"
            >
                {Object.values(ACCOUNT_TYPES)
                    .map((accountType) => (
                        <option
                            key={accountType}
                            value={accountType}
                        >
                            {accountType}
                        </option>
                    ))
                }
            </select>

            <label htmlFor="account_desc">
                Description
            </label>
            <input type="text" name="account_desc" autoComplete="off"/>

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
