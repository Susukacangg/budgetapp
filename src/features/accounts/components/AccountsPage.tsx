import type { Account } from '../model.ts'
import {AddButton, List} from "../../../shared/ui/";

type AccountsPageProps = {
  accounts: readonly Account[]
}

export function AccountsPage({accounts}: AccountsPageProps) {
    return (
      <section className="page">
          <h2>Accounts</h2>
          <p className="muted">Cash, bank, credit, and savings accounts.</p>
          {accounts.length === 0 ? (
              <p className="muted">No accounts yet.</p>
          ) : (
              <List items={accounts}/>
          )}
          <AddButton/>
      </section>
    )
}
