import {type IconProps} from './model.ts'

export function ChevronDown({width=2, style}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true"
             style={style}
        >
            <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth={`${width}`}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}