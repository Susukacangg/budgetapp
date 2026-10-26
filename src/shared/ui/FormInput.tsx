import * as React from "react";
import {CurrencyInput} from "./CurrencyInput.tsx";
import {DateTimeInput} from "./DateTimeInput.tsx";
import {RadioInput} from "./RadioInput.tsx";
import {SelectInput} from "./SelectInput.tsx";
import type {ReactNode} from "react";

type InputType =
    | "text"
    | "currency"
    | "select"
    | "date-time"
    | "textarea"
    | "submit"
    | "radio"

type CommonProps = {
    readonly autoComplete?: boolean
    readonly value?: string | number | readonly string[]
    readonly disabled?: boolean
    onKeydown?: React.KeyboardEventHandler
    onChange?: React.ChangeEventHandler
}

type FormInputProps =
    | (CommonProps & {
        readonly name: string
        readonly type: "select"
        readonly isLoading?: boolean
        readonly checked?: never
        readonly children: ReactNode
    })
    | (CommonProps & {
        readonly name?: never
        readonly type: "submit"
        readonly isLoading?: never
        readonly checked?: never
        readonly children?: never
    })
    | (CommonProps & {
        readonly name: string
        readonly type: "radio"
        readonly isLoading?: never
        readonly checked?: boolean
        readonly children?: never
    })
    | (CommonProps & {
        readonly name: string
        readonly type: Exclude<InputType, "select" | "submit" | "radio">
        readonly isLoading?: never
        readonly checked?: never
        readonly children?: never
    })

export function FormInput({
      type,
      name,
      autoComplete = false,
      disabled = false,
      value,
      isLoading,
      checked,
      children,
      onKeydown,
      onChange,
}: FormInputProps) {

    switch (type) {
        case "text":
            return <input
                        className="form-input"
                        type="text"
                        id={name}
                        name={name}
                        value={value}
                        autoComplete={autoComplete ? "on" : "off"}
                        onChange={onChange}
                        onKeyDown={onKeydown}
                        disabled={disabled}
                    />
        case "currency":
            return <CurrencyInput
                        name={name}
                        disabled={disabled}
                    />
        case "select": {
            return (
                <SelectInput
                    name={name}
                    disabled={disabled}
                    isLoading={isLoading}
                >
                    {children}
                </SelectInput>
            )
        }
        case "date-time" : {
            return <DateTimeInput
                        name={name}
                        disabled={disabled}
                    />
        }
        case "textarea" : {
            return <textarea
                        className="form-input"
                        rows={5}
                        disabled={disabled}
                        id={name}
                        name={name}
                        onChange={onChange}
                        onKeyDown={onKeydown}
            />
        }
        case "submit" : {
            return <input
                        className="form-input"
                        type="submit"
                        disabled={disabled}
            />
        }
        case "radio" : {
            return <RadioInput
                        name={name}
                        value={value}
                        onChange={onChange}
                        checked={checked}
                    />
        }
        default: {
            // @ts-expect-error Other form input types that are not defined will throw an error
            const _exhaustive: never = route
            return _exhaustive
        }
    }
}