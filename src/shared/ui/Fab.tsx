import type {MouseEventHandler, CSSProperties, ReactElement} from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FAB_POSITIONS = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const
type FabPosition = (typeof FAB_POSITIONS)[number]

type FabProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    position?: FabPosition,
    margin?: number,
    children?: ReactElement,
    style?: CSSProperties
}

export function Fab({
        onClick,
        position='bottom-right',
        margin=2,
        children,
        style
    }: Readonly<FabProps>) {

    function getPositionInset(position: string): CSSProperties {
        const margins: string = `${margin}rem`

        switch (position) {
            case 'top-right':
                return {
                    top: margins,
                    right: margins,
                    ...style,
                }
            case 'bottom-right':
                return {
                    right: margins,
                    bottom: margins,
                    ...style,
                }
            case 'top-left':
                return {
                    top: margins,
                    left: margins,
                    ...style,
                }
            case 'bottom-left':
                return {
                    bottom: margins,
                    left: margins,
                    ...style,
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
            {children}
        </button>
    )
}
