import {type CategoryDao} from './repository.ts'
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

export function groupCategories(categories: readonly Category[]): CategoryGroup[] {
  const childrenByParentId = new Map<number, Category[]>

  // find the subcategories and group them in their respective arrays based on their parentId
  for (const category of categories) {
    if (category.parentId != null) {
      const siblingCategories = childrenByParentId.get(category.parentId) ?? []
      siblingCategories.push(category)
      childrenByParentId.set(category.parentId, siblingCategories)
    }
  }

  return categories
      .filter((c) => c.parentId == null)
      .map((parent) => ({
        parent: parent,
        children: childrenByParentId.get(parent.id) ?? [],
      }))
}

export function convertCategoryFromDao(categoryDao: CategoryDao): Category {
  return {
    id: categoryDao.id,
    name: categoryDao.category_name,
    type: categoryDao.category_type,
    parentId: categoryDao.category_parent,
    categoryDesc: categoryDao.category_desc,
    createdAt: categoryDao.created_at,
  }
}


/*
* form related schemas and types
* */
export const insertCategorySchema = z.object({
  category_name: z.string().trim().min(3, "Category name is required"),
  category_type: z.enum(CATEGORY_TYPES),
  category_parent: z.preprocess(
      (value) => {
        if (value == '' || value == null) return null
        return Number(value)
      },
      z.number().nullable().optional()
  ),
  category_desc: z.string().trim().optional()
})