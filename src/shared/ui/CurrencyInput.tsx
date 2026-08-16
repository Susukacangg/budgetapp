import {type KeyboardEvent, useState} from 'react'

type CurrencyInputProps = {
    name: string
}

export function CurrencyInput({name}: CurrencyInputProps) {
    const [minorUnits, setMinorUnits] = useState('0')
    const padded = minorUnits.padStart(3, '0')
    const display = `${padded.slice(0, -2)}.${padded.slice(-2)}`

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (/^\d$/.test(event.key)) {
            event.preventDefault()
            setMinorUnits((prev) => (prev === '0' ? event.key : prev + event.key))
            return
        }

        if (event.key === 'Backspace') {
            event.preventDefault()
            setMinorUnits((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
            return
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            event.preventDefault()
        }
    }

    return (
        <input
            type="text"
            name={name}
            inputMode="numeric"
            autoComplete="off"
            value={display}
            onKeyDown={onKeyDown}
            onChange={() => {}}
        />
    )
}
