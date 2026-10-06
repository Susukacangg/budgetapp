
type DateTimeInputProps = {
    name: string
}

export function DateTimeInput({name}: DateTimeInputProps) {
    return (
        <input
            className="form-input"
            type="datetime-local"
            name={name}/>
    )
}