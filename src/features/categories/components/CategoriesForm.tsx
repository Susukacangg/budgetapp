import {useState, useMemo, type SyntheticEvent} from 'react'
import {AppForm, Spinner} from '../../../shared/ui'
import {type Category, CATEGORY_TYPES, type CategoryType} from '../model.ts'
import {FormInput} from "../../../shared/ui/FormInput.tsx";
import * as React from "react";

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
            <label>Category type</label>
            <div className="radio-wrapper">
                {categoryTypes.map((cat_type) =>
                    <FormInput
                        key={cat_type}
                        type="radio"
                        name="category_type"
                        value={cat_type}
                        checked={cat_type === selectedCategoryType}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedCategoryType(e.target.value as CategoryType)}
                    />)}
            </div>

            <label htmlFor="category_name">
                Category Name
            </label>
            <FormInput type="text" name="category_name"/>

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