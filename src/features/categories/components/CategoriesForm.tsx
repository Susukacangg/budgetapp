import {useState, useMemo, type SyntheticEvent, type ChangeEvent} from 'react'
import {AppForm, Spinner} from '../../../shared/ui'
import {type Category, CATEGORY_TYPES, type CategoryType} from '../model.ts'
import {FormInput} from "../../../shared/ui/FormInput.tsx";

type CategoriesFormProps = {
    onSubmitHandler?: (event: SyntheticEvent<HTMLFormElement>) => void,
    isLoading?: boolean,
    availableCategories: Category[] | null
}

export function CategoriesForm({onSubmitHandler, isLoading, availableCategories}: Readonly<CategoriesFormProps>) {
    const categoryTypes = Object.values(CATEGORY_TYPES)
    const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryType>(categoryTypes[0])

    const parentOptions =  useMemo(() => (
        availableCategories?.filter((category) =>
            category.type == selectedCategoryType &&
            category.parentId == null
        )) ?? [], [availableCategories, selectedCategoryType])

    return (
        <AppForm onSubmitHandler={onSubmitHandler}>
            <label htmlFor="category_name">
                Category Name
            </label>
            <FormInput type="text" name="category_name"/>

            <label htmlFor="category_type">
                Category Type
            </label>
            <FormInput
                type="select"
                name="category_type"
                value={selectedCategoryType}
                optionValues={categoryTypes}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategoryType(e.target.value as CategoryType)}
            />

            <label htmlFor="category_parent">
                Parent Category
            </label>
            <FormInput
                type="select"
                name="category_parent"
                optionValues={parentOptions}
            />

            <label htmlFor="category_desc">
                Description
            </label>
            <FormInput type="text" name="category_desc"/>

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