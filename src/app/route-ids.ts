export type AppRouteId =
  | 'accounts'
  | 'transactions'
  | 'budgets'
  | 'categories'
  | 'reports'

export const APP_ROUTES: readonly {
  id: AppRouteId
  label: string
}[] = [
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'budgets', label: 'Budgets' },
  { id: 'categories', label: 'Categories' },
  { id: 'reports', label: 'Reports' },
] as const
