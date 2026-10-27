import {type SyntheticEvent, useEffect, useState} from "react";
import {type CategoryBasic, convertCategoryBasicFromDao} from "../../categories";
import {AppForm, Spinner} from "../../../shared/ui";
import {type AccountBasic} from "../../accounts";
import {FormInput} from "../../../shared/ui/FormInput.tsx";
import {getAllAccountNamesAndIds} from "../../accounts/";
import {convertAccountBasicFromDao} from "../../accounts/model.ts";
import {getAllCategoriesBasic} from "../../categories/repository.ts";
import {TRANSACTION_TYPES, type TransactionType} from "../model.ts";
import * as React from "react";
import {SelectOption, SubOption} from "../../../shared/ui/SelectInput.tsx";

type TransactionsFormProps = {
    onSubmitHandler?: (event: SyntheticEvent<HTMLFormElement>) => void,
    isSubmitting?: boolean
}

export function TransactionsForm({
     onSubmitHandler,
     isSubmitting
}: TransactionsFormProps) {
    const transactionTypes = Object.values(TRANSACTION_TYPES)
    const [selectedTxnType, setSelectedTxnType] = useState<TransactionType>(transactionTypes[0]);
    const [availableCategories, setAvailableCategories] = useState<CategoryBasic[]>([]);
    const [availableAccounts, setAvailableAccounts] = useState<AccountBasic[]>([]);

    const [areCategoriesLoading, setAreCategoriesLoading] = useState<boolean>(false)

    const parentCategoryOptions: CategoryBasic[] = availableCategories
        .filter((cat) => (cat.parentId === null) && cat.type === selectedTxnType)
    const subCategoryOptions: CategoryBasic[] = availableCategories
        .filter((cat) => (cat.parentId !== null) && cat.type === selectedTxnType)

    const categoriesDropdownEnabled = parentCategoryOptions?.length > 0
    const accountsDropdownEnabled = availableAccounts.length > 0

    useEffect(() => {
        let areAccountInfoLoaded = false;
        let areCategoryInfoLoaded = false;

        async function fetchAllCategoriesBasic() {
            try {
                setAreCategoriesLoading(true)
                const categoriesBasic = await getAllCategoriesBasic();
                if (areCategoryInfoLoaded) return
                const converted = categoriesBasic.map((cat) => convertCategoryBasicFromDao(cat))
                setAreCategoriesLoading(false)
                setAvailableCategories(converted)
                console.log(converted)
            } catch (err) {
                if (areCategoryInfoLoaded) return
                console.log("Failed to fetch all Categories basic", err)
            }
        }

        async function fetchAllAccountBasic() {
            try {
                const accountsBasic = await getAllAccountNamesAndIds();
                if (areAccountInfoLoaded) return
                const converted = accountsBasic.map((acc) => convertAccountBasicFromDao(acc))
                setAvailableAccounts(converted)
                console.log(converted)
            } catch (err) {
                if (areAccountInfoLoaded) return
                console.log("Failed to fetch all Accounts basic", err)
            }
        }

        void fetchAllCategoriesBasic()
        void fetchAllAccountBasic()

        return () => {
            areAccountInfoLoaded = true
            areCategoryInfoLoaded = true
        }
    }, [])

    return (
        <AppForm onSubmitHandler={onSubmitHandler}>

            <label>Transaction type</label>
            <div className="radio-wrapper">
                {transactionTypes.map((txn_type) =>
                    <FormInput
                        key={txn_type}
                        type="radio"
                        name="txn_type"
                        checked={txn_type === selectedTxnType}
                        value={txn_type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedTxnType(e.target.value as TransactionType)}
                    />)}
            </div>

            <label htmlFor="txn_date_time">Date Time</label>
            <FormInput
                type="date-time"
                name="txn_date_time"
            />

            <label htmlFor="txn_category">Transaction Category</label>
            <FormInput
                type="select"
                name="txn_category"
                isLoading={areCategoriesLoading}
                disabled={!categoriesDropdownEnabled}
            >
                {parentCategoryOptions.map((cat) => (
                    <SelectOption
                        key={cat.id}
                        value={cat.id}
                        displayValue={cat.name}>
                        {subCategoryOptions.filter((subCat) => subCat.parentId === cat.id)
                            .map((subCat) => (
                            <SubOption
                                key={subCat.id}
                                value={subCat.id}
                                displayValue={subCat.name}
                            />
                        ))}
                    </SelectOption>
                ))}
            </FormInput>

            <label htmlFor="txn_account">Account</label>
            <FormInput
                type="select"
                name="txn_account"
                disabled={!accountsDropdownEnabled}
            >
                {availableAccounts.map((acc) => (
                    <SelectOption
                        key={acc.id}
                        value={acc.id}
                        displayValue={acc.name}
                    />
                ))}
            </FormInput>

            <label htmlFor="txn_amount">Amount</label>
            <FormInput
                type="currency"
                name="txn_amount"
            />

            <label htmlFor="txn_note">
                Note
            </label>
            <FormInput
                type="text"
                name="txn_note"
            />

            <label htmlFor="txn_desc">
                Extra notes
            </label>
            <FormInput
                type="textarea"
                name="txn_desc"
            />

            {isSubmitting ?
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