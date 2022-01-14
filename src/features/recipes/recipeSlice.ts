import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RecipeData } from './types';
import recipeAPI from './recipeApi';

interface IRecipeListState {
  count: number;
  recipeList: Array<RecipeData>;
  recipeDetail: RecipeData | null;
  recipesLoading: boolean;
  recipesError: string;
  recipeDetailLoading: boolean;
  recipeDetailError: string;
}

const initialState: IRecipeListState = {
  count: 0,
  recipeList: [],
  recipesLoading: false,
  recipeDetail: null,
  recipeDetailLoading: false,
  recipesError: '',
  recipeDetailError: '',
};

export const loadAllRecipes = createAsyncThunk('recipes/getall', async () => {
  const response = (await recipeAPI.getAll()) as any;
  if (response.status === 200) {
    return response.data as RecipeData[];
  }
});

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllRecipes.fulfilled, (state, { payload }) => {
        state.recipeList = payload as RecipeData[];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
      })
      .addCase(loadAllRecipes.rejected, (state, action) => {
        state.recipesError = 'Failed loading the recipes';
        state.recipesLoading = false;
      })
      .addCase(loadAllRecipes.pending, (state, action) => {
        state.recipesLoading = true;
      });
  },
});
export const recipeSelector = (state: RootState) => state.recipes;
export default recipeSlice.reducer;
