import {useModalStack} from './useModalStack.ts'
import {MODAL_VIEW_TYPE, type ModalView} from '../types'

export type PageModalController = {
    current: ModalView | null
    isOpen: boolean
    close: () => void
    openInsertForm: () => void
    openDetail: (id: number) => void
    /** Replace the stack with the new item's detail. The modal stays open. */
    replaceWithDetail: (id: number) => void
}

export function usePageModal(): PageModalController {
    const stack = useModalStack()

    function openInsertForm() {
        stack.push({kind: MODAL_VIEW_TYPE.INSERT_FORM})
    }

    function openDetail(id: number) {
        stack.push({kind: MODAL_VIEW_TYPE.DETAIL_DISPLAY, id})
    }

    function replaceWithDetail(id: number) {
        stack.reset({kind: MODAL_VIEW_TYPE.DETAIL_DISPLAY, id})
    }

    return {
        current: stack.current,
        isOpen: stack.isOpen,
        close: stack.close,
        openInsertForm,
        openDetail,
        replaceWithDetail,
    }
}
