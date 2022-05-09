// request all recipes
import http from '../../utility/http-common';
import { RecipeData } from './types';
import { RecipePayloadData } from './recipeAdd';

export const recipeCategories = ['appetizer', 'soup', 'main', 'dessert'];
class RecipeDataService {
  getAll() {
    return http.get<Array<RecipeData>>('/recipes');
  }

  getfirstRecipesOfCategory(howMany: number, category: string, family: string) {
    return http.get<Array<RecipeData>>(
      `/families/${family}/recipes?where[category1]equals=${category}&take=${howMany}`
    );
  }

  getBySinglePropertyValuePaginated(
    property: string,
    value: string,
    howMany: number,
    fromIndex: number,
    family: string,
    operator = 'equals'
  ) {
    return http.get<RecipeData>(
      `/families/${family}/recipes?where[${property}][${operator}]=${value}&take=${howMany}&skip=${fromIndex}`
    );
  }

  getRecipeCountOfCategory(category: string, family: string) {
    return http.get<Number>(
      `/families/${family}/countRecipes?where[category1]equals=${category}`
    );
  }

  get(id: string) {
    return http.get<RecipeData>(`/recipes/${id}`);
  }

  count(property: string, value: string, family: string, operator = 'equals') {
    return http.get<Number>(
      `/recipes/count?where[${property}][${operator}]=${value}`
    );
  }

  create(data: RecipePayloadData) {
    return http.post<RecipePayloadData>('/recipes', data);
  }

  update(data: RecipePayloadData, id: any) {
    return http.patch<any>(`/recipes/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/recipes/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/recipes`);
  }
}

export default new RecipeDataService();
