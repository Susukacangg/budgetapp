import {type ReactElement} from 'react'

type ModalTitleProps = {
    children: ReactElement
}

export function ModalTitle({children}: Readonly<ModalTitleProps>) {
    return children
}