import {
  addMoney,
  assertHomeCurrency,
  moneyFromMinorUnits,
  type Money,
  zeroMoney,
} from '../money'
import type { JournalEntry, PostingSide } from './types.ts'

export class UnbalancedJournalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnbalancedJournalError'
  }
}

/** Sums posting amounts for one side; requires at least one posting on that side. */
export function sumSide(
  entry: JournalEntry,
  side: PostingSide,
): Money | null {
  const matching = entry.postings.filter((p) => p.side === side)
  if (matching.length === 0) return null

  let total = zeroMoney()
  for (const posting of matching) {
    assertHomeCurrency(posting.amount)
    total = addMoney(total, posting.amount)
  }
  return total
}

/**
 * Verifies double-entry balance. Throws on non-MYR amounts or debit/credit mismatch.
 * Does not silently repair inconsistency.
 */
export function assertBalanced(entry: JournalEntry): void {
  if (entry.postings.length < 2) {
    throw new UnbalancedJournalError(
      'Journal entry requires at least two postings',
    )
  }

  for (const posting of entry.postings) {
    try {
      assertHomeCurrency(posting.amount)
    } catch {
      throw new UnbalancedJournalError(
        'Journal entry contains a non-MYR amount',
      )
    }
    if (posting.amount.minorUnits <= 0n) {
      throw new UnbalancedJournalError(
        'Posting amounts must be positive minor units',
      )
    }
  }

  const debits = sumSide(entry, 'debit')
  const credits = sumSide(entry, 'credit')

  if (!debits || !credits) {
    throw new UnbalancedJournalError(
      'Journal entry needs both debit and credit postings',
    )
  }

  if (debits.minorUnits !== credits.minorUnits) {
    throw new UnbalancedJournalError(
      `Unbalanced entry: debits ${debits.minorUnits} != credits ${credits.minorUnits}`,
    )
  }
}

/**
 * Signed balance contribution: debit increases, credit decreases for asset-style accounts.
 * Callers choose sign convention per account type at a higher layer when needed.
 */
export function signedContribution(
  amount: Money,
  side: PostingSide,
  normalSide: PostingSide,
): Money {
  assertHomeCurrency(amount)
  const sign = side === normalSide ? 1n : -1n
  return moneyFromMinorUnits(amount.minorUnits * sign)
}
