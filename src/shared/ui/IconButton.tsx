import {ReactNode, CSSProperties} from 'react'

type IconButtonProps = {
    onClick?: () => void,
    className?: string,
    style?: CSSProperties,
    children: ReactNode
}

export function IconButton({onClick, className, style, children}: IconButtonProps) {
    return (
        <button className={`round-btn icon-button ${className}`}
                style={style}
                onClick={onClick}
        >
            {children}
        </button>
    )
}