import type {ReactNode, CSSProperties} from 'react'

type ListProps = {
    children: ReactNode,
    className?: string,
    style?: CSSProperties,
}

export function List({children, className, style}: Readonly<ListProps>) {
    return (
        <div
            className={`list ${className}`}
            style={{...style}}
        >
            {children}
        </div>
    )
}