import type {CategoryDao} from "../model.ts";

export interface CategoryRepository {
    insertCategory(newCat: CategoryDao): Promise<CategoryDao>
    getAllCategories(): Promise<CategoryDao[]>
}