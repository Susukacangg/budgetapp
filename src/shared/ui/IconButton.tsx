import {ReactNode} from 'react'

type IconButtonProps = {
    onClick: () => void,
    className: string,
    children: ReactNode
}

export function IconButton({onClick, className, children}: IconButtonProps) {
    return (
        <button className={`round-btn icon-button ${className}`}
                onClick={onClick}
        >
            {children}
        </button>
    )
}