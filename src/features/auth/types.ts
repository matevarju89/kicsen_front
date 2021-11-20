//import { RecipeData, RatingData } from '../recipes/types';

export type AuthPayloadData = {
  username: string;
  password: string;
};

export type AuthenticatedUserData = {
  username: string;
  accessToken: string;
  roles: string[];
};
