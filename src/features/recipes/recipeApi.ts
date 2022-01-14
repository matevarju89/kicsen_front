// request all recipes
import http from '../../utility/http-common';
import { RecipeData } from './types';

export const recipeCategories = ['appetizer', 'soup', 'main', 'dessert'];
class RecipeDataService {
  getAll() {
    return http.get<Array<RecipeData>>('/recipes');
  }

  get(id: string) {
    return http.get<RecipeData>(`/recipes/${id}`);
  }

  create(data: RecipeData) {
    return http.post<RecipeData>('/recipes', data);
  }

  update(data: RecipeData, id: any) {
    return http.put<any>(`/recipes/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/recipes/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/recipes`);
  }
}

export default new RecipeDataService();
