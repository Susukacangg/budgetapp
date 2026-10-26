import * as React from "react";
import {
    Children, Fragment,
    isValidElement,
    type ReactElement,
    type ReactNode, useEffect,
    useRef,
    useState
} from "react";
import {Spinner} from "./Spinner.tsx";

type SubOptionProps = {
    readonly value: string | number
    readonly displayValue: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SubOption(_props: SubOptionProps) {
    return null
}

type SelectOptionProps = {
    readonly value: string | number
    readonly displayValue: string
    readonly children?: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SelectOption(_props: Readonly<SelectOptionProps>) {
    return null
}

type SelectInputProps = {
    readonly name: string
    readonly disabled?: boolean
    readonly isLoading?: boolean
    children?: ReactNode
}

export function SelectInput({
    name,
    disabled,
    isLoading,
    children
}: Readonly<SelectInputProps>) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const selectInputBarWrapperElement = useRef<HTMLDivElement>(null)

    const optionElements = Children.toArray(children).filter(isOptionElement)
    const subOptionElements = optionElements.map((option) =>
        Children.toArray(option.props.children).filter(isSubOptionElement)).flat()
    const [selectedOption, setSelectedOption] =
        useState<string | number | undefined>(undefined)
    const resolvedOptionValue = resolveOptionValue()
    const selectInputDisplay = getSelectInputDisplay()

    function getSelectInputDisplay(): string {
        const optionIndex = optionElements.findIndex((option) => option.props.value === resolvedOptionValue)
        const subOptionIndex = subOptionElements.findIndex((subOption) => subOption.props.value === resolvedOptionValue)

        let selectInputDisplayString = ''

        if (optionIndex > -1) {
            selectInputDisplayString = optionElements[optionIndex].props.displayValue
        } else if (optionIndex === -1 && subOptionIndex > -1) {
            const parentInputDisplay = optionElements.find((option) => {
                return Children.toArray(option.props.children)
                    .filter(isSubOptionElement)
                    .findIndex((subOption) => subOption.props.value === resolvedOptionValue) > -1
            })?.props.displayValue ?? ''
            selectInputDisplayString = parentInputDisplay + " / " +  subOptionElements[subOptionIndex].props.displayValue
        }

        return selectInputDisplayString
    }

    function resolveOptionValue() {
        return selectedOption !== undefined &&
            (optionElements.some((option) => option.props.value === selectedOption) ||
            subOptionElements.some((subOption) => subOption.props.value === selectedOption))
            ? selectedOption
            : optionElements[0]?.props.value
    }

    function isSubOptionElement(child: ReactNode): child is ReactElement<SubOptionProps> {
        return isValidElement(child) && child.type === SubOption
    }

    function isOptionElement(child: ReactNode): child is ReactElement<SelectOptionProps> {
        return isValidElement(child) && child.type === SelectOption
    }

    function isOptionSelected(value: string | number): boolean {
        return value === resolvedOptionValue
    }

    function onSelectOptionClick(optionValue: string | number) {
        setTimeout(() => {
            setIsOpen(false)
            setSelectedOption(optionValue)
        }, 100)
    }

    function renderDropdown() {
        const subOptionsPerOption = new Map(optionElements.map((option) => {
            return [
                option.props.value,
                Children.toArray(option.props.children).filter(isSubOptionElement)
            ]
        }))

        return (
            <div className={`select-input-dropdown-wrapper ${isOpen ? 'open' : ''}`}
                 onMouseDown={(e) => e.preventDefault()}
            >
                <div className={`select-input-dropdown-parent-option-page`}
                >
                    {optionElements.map((optElem) => {

                        const optionValue = optElem.props.value
                        const optionDisplayValue = optElem.props.displayValue
                        return renderDropdownOptions(
                            optionValue,
                            optionDisplayValue,
                            false,
                            subOptionsPerOption.get(optionValue),
                            () => onSelectOptionClick(optionValue))
                    })}
                </div>
            </div>
        )
    }

    function renderDropdownOptions(optionValue: string | number,
                                   optionDisplayValue: string,
                                   isSubOption: boolean,
                                   subOptions: ReactElement<SubOptionProps>[] | undefined,
                                   optionClickHandler: React.MouseEventHandler) {
        return (
            <Fragment key={optionValue}>
                <div
                    key={optionValue}
                    className={`select-input-dropdown-option-wrapper ${isOptionSelected(optionValue) ? 'selected' : ''}`}
                    onClick={optionClickHandler}
                >
                    <span className="select-input-dropdown-option-check-icon"
                    >
                    </span>

                    {/*└ ─ <- for future use*/}
                    <span
                        className="select-input-dropdown-option-display"
                    >
                        <span
                            style={{
                                color: 'var(--accent)'
                            }}
                        >
                            {isSubOption ? '└ ' : ''}
                        </span>
                        {optionDisplayValue}
                    </span>
                </div>
                {subOptions?.map((opts) => {
                    const subOptionValue = opts.props.value
                    return renderDropdownOptions(
                        subOptionValue,
                        opts.props.displayValue,
                        true,
                        undefined,
                        () => onSelectOptionClick(subOptionValue))
                })}
            </Fragment>
        )
    }

    useEffect(() => {
        function validateOptions() {
            const seenOptions = new Set<string | number>()
            const seenSubOptions = new Set<string | number>()

            optionElements.forEach((option) => {
                const currOptionValue = option.props.value
                if (seenOptions.has(currOptionValue))
                    throw new DOMException("Select input options cannot have duplicate values",
                        "SelectOption Integrity Exception")
                else seenOptions.add(currOptionValue)

                Children.toArray(option.props.children).filter(isSubOptionElement)
                    .forEach((subOption) => {
                        const currSubOptionValue = subOption.props.value
                        if (seenSubOptions.has(currSubOptionValue))
                            throw new DOMException("Select input sub-options cannot have duplicate values",
                                "SubOption Integrity Exception")
                        else seenSubOptions.add(currSubOptionValue)
                    })
            })
        }

        void validateOptions()
    }, [])

    useEffect(() => {
        if (isOpen) selectInputBarWrapperElement.current?.focus()
        else selectInputBarWrapperElement.current?.blur()
    }, [isOpen])

    return (
        <div className="select-input-wrapper"
             onBlur={(e) => {
                 if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false)
             }}
        >
            <div className={`select-input-bar-wrapper ${disabled || isLoading ? "disabled" : ""}`}
                 tabIndex={0}
                 ref={selectInputBarWrapperElement}
                 onClick={() => setIsOpen((prev) => {
                     if (disabled || isLoading) return false
                     return !prev
                 })}
                 onKeyDown={(e) => {
                     if (e.code === 'Escape') setIsOpen(false)
                 }}
            >
                <span
                    id={`${name}-display`}
                    className="select-input-bar-display">
                    {selectInputDisplay}
                </span>
                <input
                    id={name}
                    name={name}
                    type="hidden"
                    value={resolvedOptionValue ?? ''}
                />
                {isLoading ?
                    <Spinner
                        size={1.75}
                        borderWidth={2}
                    /> :
                    <span className={`select-input-bar-dropdown-icon ${isOpen? 'rotated' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path
                              d="M5 7.5 10 12.5 15 7.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          />
                        </svg>
                    </span>}
            </div>
            {renderDropdown()}
        </div>
    )
}