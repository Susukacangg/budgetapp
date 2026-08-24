import {type ReactNode, useEffect, useRef, CSSProperties} from 'react'

const MODAL_POSITIONS = ['right', 'left', 'center'] as const
type ModalPosition = (typeof MODAL_POSITIONS)[number]

type ModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  position: ModalPosition
  children: ReactNode
}

export function Modal({
      title,
      isOpen,
      onClose,
      position='center',
      children
    }: ModalProps) {
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

  function getModalPositionStyle(): CSSProperties {
    const properties: CSSProperties = {
      height: '100%',
      transformOrigin: `${position} center`,
    }

    switch (position) {
      case 'right':
        return {
          marginLeft: 'auto',
          ...properties
        }
      case 'left':
        return {
          marginRight: 'auto',
          ...properties
        }
      default:
        return {}
    }
  }

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
      <div className={`modal-card ${position !== 'center' ? 'side-modal' : ''}`}
           style={getModalPositionStyle()}
      >
        <div className="menu-bar">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="round-btn modal-close-btn"
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
