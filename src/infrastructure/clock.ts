/** Injectable clock for deterministic tests and audit timestamps (UTC). */
export type Clock = {
  nowUtc(): Date
}

export const systemClock: Clock = {
  nowUtc: () => new Date(),
}

export function fixedClock(isoUtc: string): Clock {
  const fixed = new Date(isoUtc)
  if (Number.isNaN(fixed.getTime())) {
    throw new Error(`Invalid fixed clock instant: ${isoUtc}`)
  }
  return {
    nowUtc: () => new Date(fixed.getTime()),
  }
}

export function toIsoUtc(date: Date): string {
  return date.toISOString()
}
