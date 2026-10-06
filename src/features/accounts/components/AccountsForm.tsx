import {type SyntheticEvent} from 'react'
import {AppForm, Spinner} from '../../../shared/ui/'
import {ACCOUNT_TYPES} from "../model.ts";
import {FormInput} from "../../../shared/ui/FormInput.tsx";

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
            <FormInput type="text" name="account_name"/>

            <label htmlFor="account_balance">
                Account Balance
            </label>
            <FormInput type="currency" name="account_balance"/>

            <label htmlFor="account_type">
                Account Type
            </label>
            <FormInput
                type="select"
                name="account_type"
                optionValues={Object.values(ACCOUNT_TYPES)}
            />

            <label htmlFor="account_desc">
                Description
            </label>
            <FormInput type="text" name="account_desc"/>

            {isLoading ?
                <Spinner size={2}
                      style={{
                          alignSelf: 'center',
                          marginTop: '5px'
                      }}
                /> :
                <FormInput type="submit"/>}
        </AppForm>
    )
}
