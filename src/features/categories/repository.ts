import type { Category } from './model.ts'
import { supabase } from '../../infrastructure/supabase'

export type CategoryDao = {
  readonly id: number
  readonly category_name: string
  readonly category_type: string
  readonly category_parent: number
  readonly category_desc?: string
  readonly created_at: string
}

export async function insert(newAccount: CategoryDao): Promise<CategoryDao> {
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

export async function getAllCategories(): Promise<CategoryDao[]> {
  const {data, error} = await supabase
      .from('category')
      .select()
  if (error) {
    throw error
  }
  return data;
}