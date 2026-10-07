
type RadioInputProps = {
    name: string
    value?: string | number | readonly string[]
}

export function RadioInput({name, value}: RadioInputProps) {
    return (
        <label htmlFor={`${name}-${value}`}>
            <input
                id={`${name}-${value}`}
                type="radio"
                name={name}
                value={value}
            />
            <span>{value}</span>
        </label>
    )
}