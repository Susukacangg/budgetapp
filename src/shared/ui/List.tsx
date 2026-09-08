import {type ReactNode} from 'react'

type ListProps = {
    children: ReactNode
}

export function List({children}: Readonly<ListProps>) {
    return (
        <ul className="list">
            {children}
        </ul>
    )
}