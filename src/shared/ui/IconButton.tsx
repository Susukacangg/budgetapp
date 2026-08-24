import {ReactNode} from 'react'

export function IconButton({children}: ReactNode) {
    return (
        <button className={"round-btn modal-close-btn"}>
            {children}
        </button>
    )
}