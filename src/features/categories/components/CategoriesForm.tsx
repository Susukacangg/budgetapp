import {useState, useMemo, FormEvent} from 'react'
import {AppForm, Spinner} from '../../../shared/ui'
import {type Category, CATEGORY_TYPES, type CategoryType} from '../model.ts'

type CategoriesFormProps = {
    onSubmitHandler?: (event: FormEvent<HTMLFormElement>) => void,
    isLoading?: boolean,
    availableCategories: Category[] | null
}

export function CategoriesForm({onSubmitHandler, isLoading, availableCategories}: CategoriesFormProps) {
    const categoryTypes = Object.values(CATEGORY_TYPES)
    const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryType>(categoryTypes[0])

    const parentOptions =  useMemo(() => (
        availableCategories?.filter((category) =>
            category.type == selectedCategoryType &&
            category.parentId == null
        )) ?? [], [availableCategories, selectedCategoryType])

    function onCategoryTypeChange(categoryType: CategoryType) {
        console.log(categoryType)
        setSelectedCategoryType(categoryType.valueOf())
    }

    return (
        <AppForm onSubmitHandler={onSubmitHandler}>
            <label htmlFor="category_name">
                Category Name
            </label>
            <input type="text" name="category_name"/>

            <label htmlFor="category_type">
                Category Type
            </label>
            <select
                name="category_type"
                id="category_type"
                value={selectedCategoryType}
                onChange={(e) => setSelectedCategoryType(e.target.value as CategoryType)}
            >
                {categoryTypes.map((type) => (
                    <option
                        key={type}
                        value={type}
                    >
                        {type}
                    </option>
                ))}
            </select>

            <label htmlFor="category_parent">
                Parent Category
            </label>
            <select
                name="category_parent"
                id="category_parent"
            >
                <option></option>
                {parentOptions.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>

            <label htmlFor="category_desc">
                Description
            </label>
            <input type="text" name="category_desc"/>

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