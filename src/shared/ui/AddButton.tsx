import type { MouseEventHandler } from 'react'

type AddButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
}

export function AddButton({ onClick }: AddButtonProps) {
    return (
        <button
            type="button"
            className="round-btn hover-btn add-btn"
            onClick={onClick}
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
