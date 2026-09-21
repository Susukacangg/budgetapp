export const MODAL_VIEW_TYPE = {
    INSERT_FORM: "insertForm",
    DETAIL_DISPLAY: "detailDisplay"
} as const

export type ModalView =
    | {kind: typeof MODAL_VIEW_TYPE.INSERT_FORM}
    | {kind: typeof MODAL_VIEW_TYPE.DETAIL_DISPLAY, id: number}