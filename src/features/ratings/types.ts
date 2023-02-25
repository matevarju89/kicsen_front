import { RecipeData } from '../recipes/types';
import { UserData } from '../user/types';

export type RatingData = {
  comment: string;
  createdAt: Date;
  id: string;
  postedBy: UserData;
  recipe: RecipeData;
  stars: number;
  updatedAt: Date;
};

export type RatingDao = {
  comment?: string;
  postedBy: { id: string };
  recipe: { id: string };
  stars: number;
};
