import * as React from "react";
import {CurrencyInput} from "./CurrencyInput.tsx";
import {DateTimeInput} from "./DateTimeInput.tsx";
import type {Category} from "../../features/categories";
import type {Account} from "../../features/accounts";

type InputType =
    | "text"
    | "currency"
    | "select"
    | "date-time"
    | "textarea"
    | "submit"

type CommonProps = {
    readonly autoComplete?: boolean
    readonly value?: string | number | readonly string[]
    onKeydown?: React.KeyboardEventHandler<HTMLInputElement>
    onChange?: React.ChangeEventHandler
}

type FormInputProps<TDetail = readonly (string | Account | Category) []> =
    | (CommonProps & {
        readonly name: string
        readonly type: "select"
        readonly optionValues: TDetail
    })
    | (CommonProps & {
        readonly name?: never
        readonly type: "submit"
        readonly optionValues?: never
    })
    | (CommonProps & {
        readonly name: string
        readonly type: Exclude<InputType, "select">
        readonly optionValues?: never
    })

export function FormInput({
      type,
      name,
      autoComplete = false,
      value,
      optionValues,
      onChange
}: FormInputProps) {

    function renderOptions() {
        if (optionValues === undefined || optionValues === null) {
            return null
        } else {
            return (
                optionValues.map((opt) => {
                    let optionValue;
                    let optionDisplayValue;

                    if (typeof opt === "string") {
                        optionValue = opt
                        optionDisplayValue = opt
                    } else {
                        optionValue = opt.id
                        optionDisplayValue = opt.name
                    }

                    return (
                        <option
                            key={optionValue}
                            value={optionValue}
                        >
                            {optionDisplayValue}
                        </option>)
                })
            )
        }
    }

    switch (type) {
        case "text":
            return <input
                        className="form-input"
                        type="text"
                        name={name}
                        value={value}
                        autoComplete={autoComplete ? "on" : "off"}
                        onChange={onChange}
                    />
        case "currency":
            return <CurrencyInput name={name}/>
        case "select": {
            return (
                <select
                    className="form-input"
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {renderOptions()}
                </select>
            )
        }
        case "date-time" : {
            return <DateTimeInput name={name}/>
        }
        case "textarea" : {
            return <textarea
                        className="form-input"
                        rows={5}/>
        }
        case "submit" : {
            return <input
                        className="form-input"
                        type="submit"/>
        }
        default: {
            // @ts-expect-error Other form input types that are not defined will throw an error
            const _exhaustive: never = route
            return _exhaustive
        }
    }
}