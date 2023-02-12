import { REPLCommand } from 'repl';
import { RecipeData } from '../recipes/types';

export type SmartTagData = {
  createdAt: Date;
  id: string;
  lang: string;
  name: string;
  recipe: Array<RecipeData>;
  updatedAt: Date;
};

export type SmartTagDao = {
  lang: string;
  name: string;
};
