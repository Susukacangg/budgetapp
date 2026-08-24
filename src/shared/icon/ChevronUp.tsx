import {type IconProps} from './model.ts'

export function ChevronUp({width=2}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
                d="M5 12.5 10 7.5 15 12.5"
                stroke="currentColor"
                strokeWidth={`${width}`}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}