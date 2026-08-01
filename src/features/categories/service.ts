import type { Category } from './model.ts'

export type CategoryRepository = {
  list(): Promise<readonly Category[]>
}

export type CategoryService = {
  list(): Promise<readonly Category[]>
}

export function createCategoryService(
  repository: CategoryRepository,
): CategoryService {
  return {
    list: () => repository.list(),
  }
}
