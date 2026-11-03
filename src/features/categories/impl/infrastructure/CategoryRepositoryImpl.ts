import type {CategoryRepository} from "../../infrastructure/CategoryRepository.ts";
import type {CategoryDao} from "../../model.ts";
import { supabase } from '../../../../infrastructure/supabase'

export class CategoryRepositoryImpl implements CategoryRepository {

    async insertCategory(newCat: CategoryDao): Promise<CategoryDao> {
        const { data, error } = await supabase
            .from('category')
            .insert(newCat)
            .select()
            .single()
        if (error) {
            throw error
        }
        return data
    }

    async getAllCategories(): Promise<CategoryDao[]> {
        const {data, error} = await supabase
            .from('category')
            .select()
        if (error) {
            throw error
        }
        return data;
    }
}