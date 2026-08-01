import type { Account } from '../model.ts'
import { formatMoney } from '../../../shared/format/money.ts'

type AccountsPageProps = {
  accounts: readonly Account[]
}

export function AccountsPage({ accounts }: AccountsPageProps) {
  return (
    <section className="page">
      <h2>Accounts</h2>
      <p className="muted">Cash, bank, credit, and savings accounts.</p>
      {accounts.length === 0 ? (
        <p className="muted">No accounts yet.</p>
      ) : (
        <ul className="list">
          {accounts.map((account) => (
            <li key={account.id}>
              <strong>{account.name}</strong>
              <span className="muted">
                {' '}
                · {account.type} · {account.currencyCode} ·{' '}
                {formatMoney(account.openingBalance)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
