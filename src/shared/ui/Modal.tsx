import {type ReactNode, useEffect, useRef} from 'react'

type ModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({title, isOpen, onClose, children}: ModalProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    shellRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    // cannot scroll in bg
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={shellRef}
      className={`modal-shell ${isOpen ? 'is-open' : ''}`}
      tabIndex={-1}
    >
      <div
        className="modal-backdrop"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="modal-card">
        <div className="menu-bar">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="round-btn hover-btn modal-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {/*area for modal contents*/}
        {children}
      </div>
    </div>
  )
}
