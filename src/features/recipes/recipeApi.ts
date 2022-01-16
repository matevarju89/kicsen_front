// request all recipes
import http from '../../utility/http-common';
import { RecipeData } from './types';

export const recipeCategories = ['appetizer', 'soup', 'main', 'dessert'];
class RecipeDataService {
  getAll() {
    return http.get<Array<RecipeData>>('/recipes');
  }

  getfirstRecipesOfCategory(howMany: number, category: string) {
    return http.get<Array<RecipeData>>(
      `/recipes?where[category1]equals=${category}&take=${howMany}`
    );
  }

  getBySinglePropertyValuePaginated(
    property: string,
    value: string,
    howMany: number,
    fromIndex: number,
    operator = 'equals'
  ) {
    return http.get<RecipeData>(
      `/recipes?where[${property}][${operator}]=${value}&take=${howMany}&skip=${fromIndex}`
    );
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
