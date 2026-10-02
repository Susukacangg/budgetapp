import {Children, type CSSProperties, isValidElement, type ReactElement, type ReactNode} from 'react'
import {MODAL_VIEW_TYPE, type ModalListItemDetailView} from '../types'
import {Modal} from './Modal.tsx'
import {ModalTitle} from './ModalTitle.tsx'
import {type PageModalController} from './usePageModal.ts'
import {ModalDetailDisplay} from './ModalDetailDisplay.tsx'
import type {Account} from "../../features/accounts";
import type {CategoryGroup} from "../../features/categories";

type PageModalInsertFormProps = {
    children: ReactNode
}

export function PageModalInsertForm({children}: PageModalInsertFormProps) {
    return (
        <>
            {children}
        </>
    )
}

export type PageModalDetailDisplayFormProps<TDetail = Account | CategoryGroup | null> = {
    resolveDetail: (id: number) => TDetail
    resolveTitle: (detail: TDetail) => string
    resolveDetailDisplay: (detail: TDetail) => ModalListItemDetailView
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PageModalDetailDisplayForm<TDetail>(_props: PageModalDetailDisplayFormProps<TDetail>) {
    return null
}

type PageModalProps = {
    modal: PageModalController
    insertTitle: string
    style?: CSSProperties
    children: ReactNode
}

export function PageModal({
    modal,
    insertTitle,
    style,
    children
}: Readonly<PageModalProps>) {
    const childrenArr: ReactNode[] = Children.toArray(children)
    const insertFormNode: ReactNode = childrenArr.find((child) => isValidElement(child) && child.type === PageModalInsertForm)
    const detailDisplayNode = childrenArr.find(
        (child): child is ReactElement<PageModalDetailDisplayFormProps> =>
            isValidElement(child) && child.type === PageModalDetailDisplayForm,
    )

    let modalTitle: ReactElement = <></>
    let modalContent: ReactNode = null

    switch (modal.current?.kind) {
        case MODAL_VIEW_TYPE.INSERT_FORM: {
            modalTitle = <h2>{insertTitle}</h2>
            modalContent = insertFormNode
            break
        }
        case MODAL_VIEW_TYPE.DETAIL_DISPLAY: {
            if (detailDisplayNode == null) {
                break
            }
            const {resolveDetail, resolveTitle, resolveDetailDisplay} = detailDisplayNode.props
            const detail = resolveDetail(modal.current.id)
            if (detail == null) {
                break
            }
            modalTitle = <h2>{resolveTitle(detail)}</h2>
            modalContent = <ModalDetailDisplay {...resolveDetailDisplay(detail)}/>
            break
        }
        default:
            break
    }

    return (
        <Modal
            isOpen={modal.isOpen}
            onClose={modal.close}
            position="right"
            style={style}
        >
            <ModalTitle>
                {modalTitle}
            </ModalTitle>
            {modalContent}
        </Modal>
    )
}
