export const AppRoutes = {
  TRANSACTIONS: 'Transactions',
  ACCOUNTS: 'Accounts',
  BUDGETS: 'Budgets',
  CATEGORIES: 'Categories',
  REPORTS: 'Reports',
}

export type AppRouteId = (typeof AppRoutes)[keyof typeof AppRoutes]