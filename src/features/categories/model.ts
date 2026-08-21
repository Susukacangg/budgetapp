export const CATEGORY_TYPES = ['Expense', 'Income'] as const
export type CategoryType = (typeof CATEGORY_TYPES)[number]

export type Category = {
  readonly id: number
  readonly name: string
  readonly type: CategoryType
  readonly parentId: number
  readonly categoryDesc?: string
  readonly createdAt: string
}
