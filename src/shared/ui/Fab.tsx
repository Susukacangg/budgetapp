import type { MouseEventHandler, CSSProperties } from 'react'
import {Add} from '../icon/'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FAB_POSITIONS = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const
type FabPosition = (typeof FAB_POSITIONS)[number]

type FabProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  position?: FabPosition
  margin?: number
}

export function Fab({ onClick, position='bottom-right', margin=2 }: Readonly<FabProps>) {

    function getPositionInset(position: string): CSSProperties {
        const margins: string = `${margin}rem`

        switch (position) {
            case 'top-right':
                return {
                    top: margins,
                    right: margins,
                }
            case 'bottom-right':
                return {
                    right: margins,
                    bottom: margins,
                }
            case 'top-left':
                return {
                    top: margins,
                    left: margins,
                }
            case 'bottom-left':
                return {
                    bottom: margins,
                    left: margins,
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
            <Add width={2.75}/>
        </button>
    )
}
