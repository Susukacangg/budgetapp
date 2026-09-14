export const DEFAULT_CURRENCY_DISPLAY = "RM"
export const DEFAULT_CURRENCY_SCALE = 2

export function minorUnitsToCurrencyDisplay(minorUnits: number): string {
  const digits = Math.abs(minorUnits).toString()
  const padded = digits.padStart(DEFAULT_CURRENCY_SCALE + 1, "0")
  const wholeNumberPart = padded.slice(0, -DEFAULT_CURRENCY_SCALE)
  const fractionNumberPart = padded.slice(-DEFAULT_CURRENCY_SCALE)

  return `${DEFAULT_CURRENCY_DISPLAY} ${wholeNumberPart}.${fractionNumberPart}`
}