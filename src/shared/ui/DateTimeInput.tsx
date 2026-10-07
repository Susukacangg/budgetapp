
type DateTimeInputProps = {
    name: string,
    disabled?: boolean
}

export function DateTimeInput({name, disabled = false}: DateTimeInputProps) {
    return (
        <input
            className="form-input"
            type="datetime-local"
            id={name}
            name={name}
            disabled={disabled}
        />
    )
}