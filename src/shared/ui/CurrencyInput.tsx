import {type KeyboardEvent, useState} from 'react'

type CurrencyInputProps = {
    name: string
    disabled?: boolean
}

export function CurrencyInput({name, disabled = false}: Readonly<CurrencyInputProps>) {
    const [minorUnits, setMinorUnits] = useState('0')
    const padded = minorUnits.padStart(3, '0')
    const display = `${padded.slice(0, -2)}.${padded.slice(-2)}`

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (/^\d$/.test(event.key)) {
            event.preventDefault()
            /*
             * if the initial amount is 0 then set to whatever other number like '1'
             * if it's not '0' then append like '1' + '2' -> '12' (minor units)
             * padded will pad the minorUnits with 0's, max length of the padded is 3, so 0's won't pad tm like 0000
             * it would be more like 000 or 012
             * */
            setMinorUnits((prev) => (prev === '0' ? event.key : prev + event.key))
            return
        }

        if (event.key === 'Backspace') {
            event.preventDefault()
            /*
            * minor units will not have the padded 0's length
            * '123' will become '|12|3' -> 12 | 012 if padded
            * */
            setMinorUnits((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
            return
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            event.preventDefault()
        }
    }

    return (
        <>
            <input
                className="form-input"
                type="text"
                id={name}
                name={name}
                inputMode="numeric"
                autoComplete="off"
                value={display}
                onKeyDown={onKeyDown}
                onChange={() => {}}
                disabled={disabled}
            />
            <input
                type="hidden"
                id={`${name}_submit`}
                name={`${name}_submit`}
                value={minorUnits}
                disabled={disabled}
            />
        </>
    )
}
