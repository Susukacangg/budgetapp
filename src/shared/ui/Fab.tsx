import type { MouseEventHandler, CSSProperties } from 'react'

const FAB_POSITIONS = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const
type FabPosition = (typeof FAB_POSITIONS)[number]

type FabProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
  position: FabPosition
  margin: number
}

export function Fab({ onClick, position='bottom-right', margins=2 }: FabProps) {

    function getPositionInset(position: string): CSSProperties {
        const margin: string = `${margins}rem`

        switch (position) {
            case 'top-right':
                return {
                    top: margin,
                    right: margin,
                }
            case 'bottom-right':
                return {
                    right: margin,
                    bottom: margin,
                }
            case 'top-left':
                return {
                    top: margin,
                    left: margin,
                }
            case 'bottom-left':
                return {
                    bottom: margin,
                    left: margin,
                }
            default:
                return {}
        }
    }

    return (
        <button
            type="button"
            className="round-btn fab"
            onClick={onClick}
            style={getPositionInset(position)}
        >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path
                    d="M10 4v12M4 10h12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                />
            </svg>
        </button>
    )
}
