import {z} from 'zod'

export const CATEGORY_TYPES = {
  EXPENSE: 'Expense',
  INCOME: 'Income'
} as const
export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES]

export type Category = {
  readonly id: number
  readonly name: string
  readonly type: CategoryType
  readonly parentId: number | null
  readonly categoryDesc: string | null
  readonly createdAt: string
}

export type CategoryGroup = {
  parent: Category,
  children: Category[]
}

export type CategoryDao = {
  readonly id: number
  readonly category_name: string
  readonly category_type: string
  readonly category_parent: number | null
  readonly category_desc: string | null
  readonly created_at: string
}

export const CategoryInsertSchema = z.object({
  name: z.string().trim().min(3, "Category name is required"),
  type: z.enum(CATEGORY_TYPES),
  parentId: z.preprocess(
      (value) => {
        if (value == '' || value == null) return null
        return Number(value)
      },
      z.number().nullable().optional()
  ),
  categoryDesc: z.string().trim().optional()
})