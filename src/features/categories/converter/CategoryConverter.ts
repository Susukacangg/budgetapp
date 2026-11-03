import type {Category, CategoryDao, CategoryGroup} from "../model.ts";

export interface CategoryConverter {
    convertToDao(cat: Category): CategoryDao
    convertToCategory(dao: CategoryDao): Category
    convertToCategoryGroup(catArr: Category[]): CategoryGroup[]
}