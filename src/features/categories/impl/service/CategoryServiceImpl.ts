import type {CategoryService} from "../../service/CategoryService.ts";
import type {Category, CategoryDao, CategoryGroup} from "../../model.ts";
import type {CategoryRepository} from "../../infrastructure/CategoryRepository.ts";
import type {CategoryConverter} from "../../converter/CategoryConverter.ts";
import {CategoryConverterImpl} from "../converter/CategoryConverterImpl.ts";
import {CategoryRepositoryImpl} from "../infrastructure/CategoryRepositoryImpl.ts";

export class CategoryServiceImpl implements CategoryService {

    private repo: CategoryRepository = new CategoryRepositoryImpl()
    private converter: CategoryConverter = new CategoryConverterImpl()

    async insertCategory(newCat: Category): Promise<Category> {
        const saved: CategoryDao =  await this.repo.insertCategory(this.converter.convertToDao(newCat));
        return this.converter.convertToCategory(saved);
    }

    async getAllCategories(): Promise<[Category[], CategoryGroup[]]> {
        const rows: CategoryDao[] = await this.repo.getAllCategories();
        const categories: Category[] = rows.map((row: CategoryDao) =>
            this.converter.convertToCategory(row))
        const grouped: CategoryGroup[] = this.converter.convertToCategoryGroup(categories)
        return [categories, grouped]
    }

}
