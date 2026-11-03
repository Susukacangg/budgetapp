import type {Category, CategoryGroup} from "../model.ts";

export interface CategoryFacade {
    createNewCategory(newCat: Category): Promise<Category>
    readAllCategories(): Promise<[Category[], CategoryGroup[]]>
}