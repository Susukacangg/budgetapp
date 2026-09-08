import {AccountsPage} from '../features/accounts'
import {BudgetsPage} from '../features/budgets'
import {CategoriesPage} from '../features/categories'
import {ReportsPage} from '../features/reports'
import {TransactionsPage} from '../features/transactions'
import {type AppRouteId, AppRoutes} from './route-ids.ts'

type RouteViewProps = {
  route: AppRouteId
}

export function RouteView({ route }: Readonly<RouteViewProps>) {
  switch (route) {
    case AppRoutes.ACCOUNTS:
      return <AccountsPage />
    case AppRoutes.TRANSACTIONS:
      return <TransactionsPage />
    case AppRoutes.BUDGETS:
      return <BudgetsPage />
    case AppRoutes.CATEGORIES:
      return <CategoriesPage />
    case AppRoutes.REPORTS:
      return <ReportsPage />
    default: {
      // @ts-expect-error Other routes that are not defined will throw an error
      const _exhaustive: never = route
      return _exhaustive
    }
  }
}
