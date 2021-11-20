import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RecipeData, RatingData, RecipeImage } from './types';
import recipeAPI from './recipeApi';

interface IRecipeListState {
  count: number;
  recipes: Array<number>;
}

interface IRecipeAPIError {
  statusCode: number;
  message: string;
}

const initialState: IRecipeListState = {
  count: 0,
  recipes: [],
};

export const loadAllRecipes = createAsyncThunk(
  'recipes/getall',
  async ({}, thunkApi) => {
    const response = (await recipeAPI.getAll()) as any;
    if (response.status === 201) {
      return response.data as RecipeData[];
    } else if (response.status === 403) {
      thunkApi.rejectWithValue(response.data as IRecipeAPIError);
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  /*extraReducers: (builder){

  }*/
});
