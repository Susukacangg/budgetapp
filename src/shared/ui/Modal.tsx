import {type ReactNode, useEffect, useRef, type CSSProperties, Children, isValidElement} from 'react'
import {IconButton} from './IconButton.tsx'
import {Cross} from '../icon'
import {ModalTitle} from "./ModalTitle.tsx";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MODAL_POSITIONS = ['right', 'left', 'center'] as const
type ModalPosition = (typeof MODAL_POSITIONS)[number]

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  position?: ModalPosition
  children: ReactNode,
  style?: CSSProperties
}

export function Modal({
      isOpen,
      onClose,
      position='center',
      children,
      style
    }: Readonly<ModalProps>) {
  const shellRef = useRef<HTMLDivElement>(null)
  const childrenArr = Children.toArray(children)
  const modalTitle = childrenArr.find((child) => isValidElement(child) && child.type === ModalTitle)
  const modalContent = childrenArr.filter((child) => child !== modalTitle)

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
      style={{
        zIndex: 100,
        ...style
      }}
    >
      <div
        className="modal-backdrop"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className={`modal-card ${position !== 'center' ? 'side-modal' : ''}`}
           style={getModalPositionStyle()}
      >
        <IconButton className={"modal-close-btn"}
                    onClick={onClose}
        >
          <Cross/>
        </IconButton>
        <div className="menu-bar">
          {modalTitle}
        </div>
        {/*area for modal contents*/}
        {modalContent}
      </div>
    </div>
  )
}
