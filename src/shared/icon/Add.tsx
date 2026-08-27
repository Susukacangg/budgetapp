import {type IconProps} from './model.ts'

export function Add({width=2}: IconProps) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path
                d="M10 4v12M4 10h12"
                fill="none"
                stroke="currentColor"
                strokeWidth={width}
                strokeLinecap="round"
            />
        </svg>
    )
}