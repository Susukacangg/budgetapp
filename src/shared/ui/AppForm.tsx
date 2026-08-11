import {type FormEvent, type ReactNode} from 'react'

type AppFormProps = {
    onSubmitHandler: (event: FormEvent<HTMLFormElement>) => void
    children: ReactNode
}

export function AppForm({onSubmitHandler, children}: AppFormProps) {
    return (
        <div tabIndex={-1}>
            <form className="app-form" onSubmit={onSubmitHandler}>
                {children}
            </form>
        </div>
    )
}