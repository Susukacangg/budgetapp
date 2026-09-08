import type {ReactNode, SyntheticEvent} from 'react'

type AppFormProps = {
    onSubmitHandler?: (event: SyntheticEvent<HTMLFormElement>) => void
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