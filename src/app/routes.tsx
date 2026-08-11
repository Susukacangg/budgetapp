import type {Account} from '../features/accounts'
import {AccountsPage} from '../features/accounts'
import {BudgetsPage} from '../features/budgets'
import {CategoriesPage} from '../features/categories'
import {ReportsPage} from '../features/reports'
import {TransactionsPage} from '../features/transactions'
import type {AppRouteId} from './route-ids.ts'

type RouteViewProps = {
  route: AppRouteId
}

export function RouteView({ route }: RouteViewProps) {
  switch (route) {
    case 'accounts':
      return <AccountsPage />
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
