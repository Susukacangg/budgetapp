import {ReactNode} from 'react'

type ListProps = {
    children: ReactNode
}

export function List({children}: ListProps) {
    return (
        <ul className="list">
            {children}
        </ul>
    )
}