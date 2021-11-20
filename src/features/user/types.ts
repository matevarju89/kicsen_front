import { RecipeData, RatingData } from '../recipes/types';

export type FamilyData = {
  createdAt: Date;
  description: string | null;
  id: string;
  member?: Array<UserData>;
  updatedAt: Date;
};

export type UserData = {
  createdAt: Date;
  families?: Array<FamilyData>;
  favoriteRecipes?: Array<RecipeData>;
  firstName: string | null;
  id: string;
  lastName: string | null;
  postedRecipes?: Array<RecipeData>;
  ratings?: Array<RatingData>;
  roles: Array<string>;
  updatedAt: Date;
  username: string;
};
