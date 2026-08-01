import { AccountsPage } from '../features/accounts/index.ts'
import { BudgetsPage } from '../features/budgets/index.ts'
import { CategoriesPage } from '../features/categories/index.ts'
import { ReportsPage } from '../features/reports/index.ts'
import { TransactionsPage } from '../features/transactions/index.ts'
import type { Account } from '../features/accounts/index.ts'
import type { AppRouteId } from './route-ids.ts'

type RouteViewProps = {
  route: AppRouteId
  accounts: readonly Account[]
}

export function RouteView({ route, accounts }: RouteViewProps) {
  switch (route) {
    case 'accounts':
      return <AccountsPage accounts={accounts} />
    case 'transactions':
      return <TransactionsPage />
    case 'budgets':
      return <BudgetsPage />
    case 'categories':
      return <CategoriesPage />
    case 'reports':
      return <ReportsPage />
    default: {
      const _exhaustive: never = route
      return _exhaustive
    }
  }
}
