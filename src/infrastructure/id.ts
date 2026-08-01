/** Injectable ID source — never call randomness directly from domain logic. */
export type IdGenerator = {
  next(): string
}

export function createCryptoIdGenerator(
  prefix?: string,
): IdGenerator {
  return {
    next: () => {
      const id = crypto.randomUUID()
      return prefix ? `${prefix}_${id}` : id
    },
  }
}

/** Deterministic sequence for tests. */
export function createSequentialIdGenerator(
  prefix = 'id',
  start = 1,
): IdGenerator {
  let n = start
  return {
    next: () => `${prefix}_${n++}`,
  }
}
