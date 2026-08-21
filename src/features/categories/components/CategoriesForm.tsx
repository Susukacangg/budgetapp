import {useState} from 'react'
import {AppForm, CurrencyInput, Spinner} from '../../../shared/ui'

export function CategoriesForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <AppForm>
            <label htmlFor="category_name">
                Category Name
            </label>
            <input type="text" name="category_name"/>

            <label htmlFor="category_type">
                Category Type
            </label>
            <input type="text" name="category_type"/>

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