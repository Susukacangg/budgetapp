import * as React from "react";

type RadioInputProps = {
    name: string
    value?: string | number | readonly string[]
    checked?: boolean
    onChange?: React.ChangeEventHandler
}

export function RadioInput({name, value, checked, onChange}: RadioInputProps) {
    return (
        <label htmlFor={`${name}-${value}`}>
            <input
                id={`${name}-${value}`}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span>{value}</span>
        </label>
    )
}