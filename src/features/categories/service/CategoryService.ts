import type {Category, CategoryGroup} from "../model.ts";

export interface CategoryService {
    insertCategory(newCat: Category): Promise<Category>
    getAllCategories(): Promise<[Category[], CategoryGroup[]]>
}