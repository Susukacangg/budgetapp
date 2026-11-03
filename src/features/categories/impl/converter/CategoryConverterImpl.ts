import type {CategoryConverter} from "../../converter/CategoryConverter.ts";
import type {Category, CategoryDao, CategoryGroup, CategoryType} from "../../model.ts";

export class CategoryConverterImpl implements CategoryConverter {
    convertToDao(cat: Category): CategoryDao {
        return {
            category_desc: cat.categoryDesc,
            category_name: cat.name,
            category_parent: cat.parentId,
            category_type: cat.type,
            created_at: cat.createdAt,
            id: cat.id
        };
    }

    convertToCategory(dao: CategoryDao): Category {
        return {
            categoryDesc: dao.category_desc,
            createdAt: dao.created_at,
            id: dao.id,
            name: dao.category_name,
            parentId: dao.category_parent,
            type: dao.category_type as CategoryType
        };
    }

    convertToCategoryGroup(categories: readonly Category[]): CategoryGroup[] {
        const childrenByParentId = new Map<number, Category[]>

        // group the children cats by parentIDs
        for (const cat of categories) {
            const currParent = cat.parentId
            if (currParent != null) {
                const siblingCategories = childrenByParentId.get(currParent) ?? []
                siblingCategories.push(cat)
                childrenByParentId.set(currParent, siblingCategories)
            }
        }

        // return the array of CategoryGroup
        // iterate over each parent category
        return categories
            .filter((cat) => cat.parentId === null)
            .map((cat) => {
                return {
                    parent: cat,
                    children: childrenByParentId.get(cat.id) ?? []
                } as CategoryGroup
            })
    }

}