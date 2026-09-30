import {Children, type CSSProperties, isValidElement, type ReactElement, type ReactNode} from 'react'
import {MODAL_VIEW_TYPE} from '../types'
import {Modal} from './Modal.tsx'
import {ModalTitle} from './ModalTitle.tsx'
import {type PageModalController} from './usePageModal.ts'

type PageModalContentProps = {
    children: ReactNode
}

export function PageModalContent({children}: PageModalContentProps) {
    return (
        <>
            {children}
        </>
    )
}

type PageModalDetail = {
    title: string
    content: ReactNode
}

type PageModalProps = {
    modal: PageModalController
    insertTitle: string
    resolveDetail: (id: number) => PageModalDetail | null
    style?: CSSProperties
    children: ReactNode
}

export function PageModal({
    modal,
    insertTitle,
    resolveDetail,
    style,
    children
}: Readonly<PageModalProps>) {
    const childrenArr: ReactNode[] = Children.toArray(children)
    const pageModalNode: ReactNode = childrenArr.find((child) => isValidElement(child) && child.type === PageModalContent)
    const presented = presentModalView(modal, insertTitle, pageModalNode, resolveDetail)

    return (
        <Modal
            isOpen={modal.isOpen}
            onClose={modal.close}
            position="right"
            style={style}
        >
            <ModalTitle>
                {presented.title}
            </ModalTitle>
            {presented.body}
        </Modal>
    )
}

function presentModalView(
    modal: PageModalController,
    insertTitle: string,
    insertContent: ReactNode,
    resolveDetail: (id: number) => PageModalDetail | null,
): {title: ReactElement, body: ReactNode} {
    switch (modal.current?.kind) {
        case MODAL_VIEW_TYPE.INSERT_FORM:
            return {
                title: <h2>{insertTitle}</h2>,
                body: insertContent,
            }
        case MODAL_VIEW_TYPE.DETAIL_DISPLAY: {
            const detail = resolveDetail(modal.current.id)
            if (detail == null) {
                return {title: <></>, body: null}
            }
            return {
                title: <h2>{detail.title}</h2>,
                body: detail.content,
            }
        }
        default:
            return {title: <></>, body: null}
    }
}
