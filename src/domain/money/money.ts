import {
  HOME_CURRENCY,
  HOME_CURRENCY_SCALE,
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
  /** Always MYR — kept on the value so amount and currency stay paired. */
  readonly currencyCode: CurrencyCode
  /** Always 2 for MYR (sen). */
  readonly scale: number
}

export class CurrencyMismatchError extends Error {
  constructor(message = 'Money value is not MYR') {
    super(message)
    this.name = 'CurrencyMismatchError'
  }
}

function assertHomeMoneyShape(currencyCode: string, scale: number): void {
  const code = parseCurrencyCode(currencyCode)
  if (code !== HOME_CURRENCY) {
    throw new CurrencyMismatchError(
      `Unsupported currency: ${currencyCode}. Only MYR (RM) is supported.`,
    )
  }
  if (scale !== HOME_CURRENCY_SCALE) {
    throw new CurrencyMismatchError(
      `Unsupported scale: ${scale}. MYR uses scale ${HOME_CURRENCY_SCALE}.`,
    )
  }
}

export function moneyFromMinorUnits(minorUnits: bigint): Money {
  return Object.freeze({
    minorUnits,
    currencyCode: HOME_CURRENCY,
    scale: HOME_CURRENCY_SCALE,
  })
}

/**
 * Parses a decimal string (e.g. "12.34", "-0.50") into MYR Money.
 * Rejects scientific notation and binary floats — pass strings only at boundaries.
 */
export function moneyFromDecimalString(
  decimal: string,
  options?: { rounding?: RoundingMode },
): Money {
  const scale = HOME_CURRENCY_SCALE
  const rounding = options?.rounding ?? 'half_even'

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
    return moneyFromMinorUnits(negative ? -minor : minor)
  }

  const kept = fractionPart.slice(0, scale)
  const remainder = fractionPart.slice(scale)
  const baseDigits = `${wholePart}${kept}`
  let minor = BigInt(baseDigits || '0')
  const shouldRoundUp = decideRoundUp(minor, remainder, rounding)

  if (shouldRoundUp) {
    minor += 1n
  }

  return moneyFromMinorUnits(negative ? -minor : minor)
}

export function zeroMoney(): Money {
  return moneyFromMinorUnits(0n)
}

/** Defensive check for values loaded from storage or external input. */
export function assertHomeCurrency(value: Money): void {
  assertHomeMoneyShape(value.currencyCode, value.scale)
}

export function addMoney(left: Money, right: Money): Money {
  assertHomeCurrency(left)
  assertHomeCurrency(right)
  return moneyFromMinorUnits(left.minorUnits + right.minorUnits)
}

export function subtractMoney(left: Money, right: Money): Money {
  assertHomeCurrency(left)
  assertHomeCurrency(right)
  return moneyFromMinorUnits(left.minorUnits - right.minorUnits)
}

export function negateMoney(value: Money): Money {
  assertHomeCurrency(value)
  return moneyFromMinorUnits(-value.minorUnits)
}

export function compareMoney(left: Money, right: Money): -1 | 0 | 1 {
  assertHomeCurrency(left)
  assertHomeCurrency(right)
  if (left.minorUnits < right.minorUnits) return -1
  if (left.minorUnits > right.minorUnits) return 1
  return 0
}

export function moneyToDecimalString(value: Money): string {
  assertHomeCurrency(value)
  const negative = value.minorUnits < 0n
  const abs = negative ? -value.minorUnits : value.minorUnits
  const digits = abs.toString().padStart(value.scale + 1, '0')
  const whole = digits.slice(0, -value.scale)
  const fraction = digits.slice(-value.scale)
  const body = `${whole}.${fraction}`
  return negative ? `-${body}` : body
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
