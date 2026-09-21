import {useCallback, useEffect, useRef, useState} from 'react'
import {type ModalView} from './model.ts'

/** Same duration as the `.modal-card` transition in index.css. */
const MODAL_EXIT_MS = 400

type ModalStackState = {
    stack: ModalView[]
    isOpen: boolean
}

export type ModalStack = {
    current: ModalView | null
    isOpen: boolean
    push: (view: ModalView) => void
    /** Replace the stack with one view. The modal stays open. */
    reset: (view: ModalView) => void
    /** Dismiss the top view. Animates shut only when it was the last view. */
    close: () => void
}

export function useModalStack(): ModalStack {
    const [state, setState] = useState<ModalStackState>({
        stack: [],
        isOpen: false,
    })
    const stateRef = useRef(state)
    const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (exitTimerRef.current !== null) {
                clearTimeout(exitTimerRef.current)
            }
        }
    }, [])

    const clearExitTimer = () => {
        if (exitTimerRef.current !== null) {
            clearTimeout(exitTimerRef.current)
            exitTimerRef.current = null
        }
    }

    const push = (view: ModalView) => {
        clearExitTimer()
        const previous = stateRef.current
        // A view left mounted for the exit animation should not sit under the new one.
        const base = previous.isOpen ? previous.stack : []
        const next = {isOpen: true, stack: [...base, view]}
        stateRef.current = next
        setState(next)
    }

    const reset = (view: ModalView) => {
        clearExitTimer()
        const next = {isOpen: true, stack: [view]}
        stateRef.current = next
        setState(next)
    }

    const close = useCallback(() => {
        const {stack, isOpen} = stateRef.current
        if (!isOpen || stack.length === 0) return

        // drill up, if stack is more than 1
        if (stack.length > 1) {
            const drillUp = {isOpen: true, stack: stack.slice(0, -1)}
            stateRef.current = drillUp
            setState(drillUp)
            return
        }

        const closing = {isOpen: false, stack}
        stateRef.current = closing
        setState(closing)
        exitTimerRef.current = setTimeout(() => {
            exitTimerRef.current = null
            // Ignore the timer if a newer view was pushed before it fired.
            if (stateRef.current !== closing) return
            const empty = {isOpen: false, stack: []}
            stateRef.current = empty
            setState(empty)
        }, MODAL_EXIT_MS)
    }, [])

    return {
        current: state.stack.at(-1) ?? null,
        isOpen: state.isOpen,
        push,
        reset,
        close,
    }
}
