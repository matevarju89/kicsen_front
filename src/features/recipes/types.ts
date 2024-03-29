import { UserData } from '../user/types';
import { SmartTagData } from '../smartTag/types';

export type RecipeImage = {
  createdAt: Date;
  height: number | null;
  id: string;
  recipe?: RecipeData | null;
  updatedAt: Date;
  url: string | null;
  width: number | null;
};

export type RecipeData = {
  category1?: 'appetizer' | 'soup' | 'main' | 'dessert';
  category2?: 'salty' | 'sweet';
  category3?: 'vegan' | 'nonvegan';
  category4?: Array<
    'chicken' | 'seafood' | 'beef' | 'veal' | 'lamb' | 'vegetable' | 'fruit'
  >;
  createdAt: Date;
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  id: string;
  images?: Array<RecipeImage>;
  ingredients: string;
  smartTags?: Array<SmartTagData>;
  likedBy?: Array<UserData>;
  postedBy?: UserData | null;
  ratings?: Array<RatingData>;
  title: string;
  updatedAt?: Date;
  forHowMany: number;
  family: { id: string };
};

export type RatingData = {
  comment: string | null;
  createdAt: Date;
  id: string;
  postedBy?: UserData;
  recipe?: RecipeData;
  stars: number;
  updatedAt?: Date;
};
