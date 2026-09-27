export type ParentChildEntity<T> = {
    parent: T,
    children: T[]
}

export type ModalListItemDetailField = {
    readonly htmlFor: string
    readonly label: string
    readonly value: string
}

export type ModalListItemSublistDetail = {
    readonly id: number
    readonly label: string
}

export type ModalListItemSublistSection = {
    readonly title: string
    readonly items: readonly ModalListItemSublistDetail[]
    readonly onItemSelect?: (id: number) => void
}

export type ModalListItemDetailView = {
    readonly displayFields: readonly ModalListItemDetailField[]
    readonly sublistSection?: ModalListItemSublistSection
    readonly onDelete?: () => void
}

export const MODAL_VIEW_TYPE = {
    INSERT_FORM: "insertForm",
    DETAIL_DISPLAY: "detailDisplay"
} as const

export type ModalView =
    | {kind: typeof MODAL_VIEW_TYPE.INSERT_FORM}
    | {kind: typeof MODAL_VIEW_TYPE.DETAIL_DISPLAY, id: number}
