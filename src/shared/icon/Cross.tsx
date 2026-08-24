import {type IconProps} from './model.ts'

export function Cross({width=2}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
                d="M6 6 14 14M14 6 6 14"
                stroke="currentColor"
                strokeWidth={`${width}`}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}