import {type ReactNode} from 'react'

export function AppForm({children}: ReactNode) {
    return (
        <div tabIndex={-1}>
            <form className="app-form">
                {children}
            </form>
        </div>
    )
}