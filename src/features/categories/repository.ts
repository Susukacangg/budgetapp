import { supabase } from '../../infrastructure/supabase'

export type CategoryDao = {
  readonly id: number
  readonly category_name: string
  readonly category_type: string
  readonly category_parent: number
  readonly category_desc: string | null
  readonly created_at: string
}

export type CategoryBasicDao = {
  readonly id: number
  readonly category_name: string
  readonly category_type: string
  readonly category_parent: number
}

export async function insertCategory(newAccount: CategoryDao): Promise<CategoryDao> {
  const { data, error } = await supabase
      .from('category')
      .insert(newAccount)
      .select()
      .single()
  if (error) {
    throw error
  }
  return data
}

export async function getAllCategoriesBasic(): Promise<CategoryBasicDao[]> {
  const {data, error} = await supabase
      .from('category')
      .select("id, category_name, category_type, category_parent")

  if (error) {
    throw error
  }
  return data
}

export async function getAllCategories(): Promise<CategoryDao[]> {
  const {data, error} = await supabase
      .from('category')
      .select()
  if (error) {
    throw error
  }
  return data;
}