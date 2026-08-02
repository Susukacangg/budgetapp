export type CategoryType = 'Expense' | 'Income'

export type Category = {
  readonly id: string
  readonly name: string
  readonly type: CategoryType
  readonly parentId: string | null
}
