import type {CategoryFacade} from "../../facade/CategoryFacade.ts";
import type {Category, CategoryGroup} from "../../model.ts";
import type {CategoryService} from "../../service/CategoryService.ts";
import {CategoryServiceImpl} from "../service/CategoryServiceImpl.ts";

export class CategoryFacadeImpl implements CategoryFacade {

    private service: CategoryService = new CategoryServiceImpl()

    createNewCategory(newCat: Category): Promise<Category> {
        return this.service.insertCategory(newCat);
    }

    readAllCategories(): Promise<[Category[], CategoryGroup[]]> {
        return this.service.getAllCategories();
    }

}