import type { CategoryRepository } from './service.ts'

export function createInMemoryCategoryRepository(): CategoryRepository {
  return {
    list: async () => [],
  }
}
