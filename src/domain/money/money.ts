import {
  defaultScaleForCurrency,
  parseCurrencyCode,
  type CurrencyCode,
} from './currency.ts'

/**
 * Explicit rounding for decimal → minor-unit conversion.
 * Arithmetic on Money always operates on already-quantized minor units.
 */
export type RoundingMode = 'half_up' | 'half_even' | 'floor' | 'ceil'

export type Money = {
  readonly minorUnits: bigint
  readonly currencyCode: CurrencyCode
  readonly scale: number
}

export class CurrencyMismatchError extends Error {
  constructor(left: CurrencyCode, right: CurrencyCode) {
    super(`Currency mismatch: ${left} vs ${right}`)
    this.name = 'CurrencyMismatchError'
  }
}

export function moneyFromMinorUnits(
  minorUnits: bigint,
  currencyCode: string,
  scale: number = defaultScaleForCurrency(parseCurrencyCode(currencyCode)),
): Money {
  const code = parseCurrencyCode(currencyCode)
  assertValidScale(scale)
  return Object.freeze({
    minorUnits,
    currencyCode: code,
    scale,
  })
}

/**
 * Parses a decimal string (e.g. "12.34", "-0.50") into Money.
 * Rejects scientific notation and binary floats — pass strings only at boundaries.
 */
export function moneyFromDecimalString(
  decimal: string,
  currencyCode: string,
  options?: { scale?: number; rounding?: RoundingMode },
): Money {
  const code = parseCurrencyCode(currencyCode)
  const scale = options?.scale ?? defaultScaleForCurrency(code)
  const rounding = options?.rounding ?? 'half_even'
  assertValidScale(scale)

  const trimmed = decimal.trim()
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error(`Invalid decimal money string: ${decimal}`)
  }

  const negative = trimmed.startsWith('-')
  const unsigned = negative ? trimmed.slice(1) : trimmed
  const [wholePart, fractionPart = ''] = unsigned.split('.')

  if (fractionPart.length <= scale) {
    const padded = fractionPart.padEnd(scale, '0')
    const digits = `${wholePart}${padded}`
    const minor = BigInt(digits || '0')
    return moneyFromMinorUnits(negative ? -minor : minor, code, scale)
  }

  const kept = fractionPart.slice(0, scale)
  const remainder = fractionPart.slice(scale)
  const baseDigits = `${wholePart}${kept}`
  let minor = BigInt(baseDigits || '0')
  const shouldRoundUp = decideRoundUp(minor, remainder, rounding)

  if (shouldRoundUp) {
    minor += 1n
  }

  return moneyFromMinorUnits(negative ? -minor : minor, code, scale)
}

export function zeroMoney(currencyCode: string, scale?: number): Money {
  const code = parseCurrencyCode(currencyCode)
  return moneyFromMinorUnits(
    0n,
    code,
    scale ?? defaultScaleForCurrency(code),
  )
}

export function assertSameCurrency(left: Money, right: Money): void {
  if (
    left.currencyCode !== right.currencyCode ||
    left.scale !== right.scale
  ) {
    throw new CurrencyMismatchError(left.currencyCode, right.currencyCode)
  }
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right)
  return moneyFromMinorUnits(
    left.minorUnits + right.minorUnits,
    left.currencyCode,
    left.scale,
  )
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right)
  return moneyFromMinorUnits(
    left.minorUnits - right.minorUnits,
    left.currencyCode,
    left.scale,
  )
}

export function negateMoney(value: Money): Money {
  return moneyFromMinorUnits(
    -value.minorUnits,
    value.currencyCode,
    value.scale,
  )
}

export function compareMoney(left: Money, right: Money): -1 | 0 | 1 {
  assertSameCurrency(left, right)
  if (left.minorUnits < right.minorUnits) return -1
  if (left.minorUnits > right.minorUnits) return 1
  return 0
}

export function moneyToDecimalString(value: Money): string {
  const negative = value.minorUnits < 0n
  const abs = negative ? -value.minorUnits : value.minorUnits
  const digits = abs.toString().padStart(value.scale + 1, '0')
  const whole =
    value.scale === 0 ? digits : digits.slice(0, -value.scale)
  const fraction = value.scale === 0 ? '' : digits.slice(-value.scale)
  const body = value.scale === 0 ? whole : `${whole}.${fraction}`
  return negative ? `-${body}` : body
}

function assertValidScale(scale: number): void {
  if (!Number.isInteger(scale) || scale < 0 || scale > 10) {
    throw new Error(`Unsupported money scale: ${scale}`)
  }
}

function decideRoundUp(
  truncatedMinor: bigint,
  remainderDigits: string,
  mode: RoundingMode,
): boolean {
  if (!remainderDigits || /^0+$/.test(remainderDigits)) {
    return false
  }

  const first = Number(remainderDigits[0] ?? '0')
  const hasMore = remainderDigits.slice(1).split('').some((d) => d !== '0')

  switch (mode) {
    case 'floor':
      return false
    case 'ceil':
      return true
    case 'half_up':
      return first >= 5
    case 'half_even': {
      if (first < 5) return false
      if (first > 5 || hasMore) return true
      // Exactly half: round to even minor unit
      return truncatedMinor % 2n !== 0n
    }
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}
