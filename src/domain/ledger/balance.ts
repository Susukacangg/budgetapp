import {
  addMoney,
  assertSameCurrency,
  moneyFromMinorUnits,
  type Money,
  zeroMoney,
} from '../money/index.ts'
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

  let total = zeroMoney(
    matching[0]!.amount.currencyCode,
    matching[0]!.amount.scale,
  )
  for (const posting of matching) {
    assertSameCurrency(total, posting.amount)
    total = addMoney(total, posting.amount)
  }
  return total
}

/**
 * Verifies double-entry balance. Throws on currency mix or debit/credit mismatch.
 * Does not silently repair inconsistency.
 */
export function assertBalanced(entry: JournalEntry): void {
  if (entry.postings.length < 2) {
    throw new UnbalancedJournalError(
      'Journal entry requires at least two postings',
    )
  }

  const currency = entry.postings[0]!.amount.currencyCode
  const scale = entry.postings[0]!.amount.scale

  for (const posting of entry.postings) {
    if (
      posting.amount.currencyCode !== currency ||
      posting.amount.scale !== scale
    ) {
      throw new UnbalancedJournalError(
        'Journal entry mixes currencies or scales',
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
  const sign = side === normalSide ? 1n : -1n
  return moneyFromMinorUnits(
    amount.minorUnits * sign,
    amount.currencyCode,
    amount.scale,
  )
}
