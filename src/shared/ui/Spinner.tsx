type SpinnerProps = {
    size: number,
    borderWidth: number,
    colorString: string,
    style: CSSStyleProperties,
}

export function Spinner(
    {
        size=5,
        borderWidth=6,
        colorString = 'var(--accent)',
        style
    }: SpinnerProps) {
    return (
        <div
            style={{
                width: `${size}rem`,
                height: `${size}rem`,
                borderWidth: `${borderWidth}px`,
                borderStyle: 'solid',
                borderTopColor: 'var(--bg)',
                borderRightColor: `color-mix(in srgb, ${colorString} 80%, var(--bg))`,
                borderBottomColor: `color-mix(in srgb, ${colorString} 80%, var(--bg))`,
                borderLeftColor: `color-mix(in srgb, ${colorString} 80%, var(--bg))`,
                borderRadius: '50%',
                animationName: 'spinner',
                animationDuration: '1s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                ...style
                }}
        >
        </div>
    )
}