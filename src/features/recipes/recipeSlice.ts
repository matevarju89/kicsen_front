import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RecipeData } from './types';
import recipeAPI, { recipeCategories } from './recipeApi';

interface IRecipeListState {
  count: number;
  recipeList: Array<RecipeData>;
  recipeDetail: RecipeData | null;
  recipesLoading: boolean;
  recipesError: string;
  recipeDetailLoading: boolean;
  recipeDetailError: string | undefined;
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

export const loadRecipe = createAsyncThunk(
  'recipes/get',
  async (id: string, { rejectWithValue }) => {
    const response = (await recipeAPI.get(id)) as any;
    //if (response.status === 200) {
    return response.data as RecipeData;
    //}
  }
);

export const loadFirstRecipesOfCategories = createAsyncThunk(
  'recipes/getfirstrecipesofcategories',
  async () => {
    let results: any = [];
    const promises = recipeCategories.map(async (category) => {
      const response = (await recipeAPI.getfirstRecipesOfCategory(
        6,
        category
      )) as any;
      if (response.status === 200) {
        results = [...results, ...response.data];
      }
    });
    await Promise.all(promises);
    return results;
  }
);

export const loadCategoryPaginated = createAsyncThunk(
  'recipes/getcategory',
  async (category: any, fromIndex: any) => {
    const response = (await recipeAPI.getBySinglePropertyValuePaginated(
      'category1',
      category,
      12,
      fromIndex
    )) as any;
    if (response.status === 200) {
      return response.data as RecipeData[];
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearRecipeDetailState: (state) => {
      state.recipeDetail = null;
      state.recipeDetailError = '';
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllRecipes.fulfilled, (state, { payload }) => {
        state.recipeList = payload as RecipeData[];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
        return state;
      })
      .addCase(loadAllRecipes.rejected, (state, action) => {
        state.recipesError = 'Failed loading the recipes';
        state.recipesLoading = false;
        return state;
      })
      .addCase(loadAllRecipes.pending, (state, action) => {
        state.recipesLoading = true;
        return state;
      })
      .addCase(loadFirstRecipesOfCategories.fulfilled, (state, { payload }) => {
        state.recipeList = payload as RecipeData[];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
        return state;
      })
      .addCase(loadFirstRecipesOfCategories.rejected, (state, action) => {
        state.recipesError = 'Failed loading the recipes';
        state.recipesLoading = false;
        return state;
      })
      .addCase(loadFirstRecipesOfCategories.pending, (state, action) => {
        state.recipesLoading = true;
        return state;
      })
      .addCase(loadCategoryPaginated.fulfilled, (state, { payload }) => {
        state.recipeList = [...state.recipeList, ...(payload as RecipeData[])];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
        return state;
      })
      .addCase(loadCategoryPaginated.rejected, (state, action) => {
        state.recipesError = 'Failed loading the recipes';
        state.recipesLoading = false;
        return state;
      })
      .addCase(loadCategoryPaginated.pending, (state, action) => {
        state.recipesLoading = true;
        return state;
      })
      .addCase(loadRecipe.pending, (state, action) => {
        state.recipeDetailLoading = true;
        return state;
      })
      .addCase(loadRecipe.rejected, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetailError = action.error.message;
        return state;
      })
      .addCase(loadRecipe.fulfilled, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetailError = initialState.recipeDetailError;
        state.recipeDetail = action.payload
          ? (action.payload as RecipeData)
          : null;
        return state;
      });
  },
});
export const { clearRecipeDetailState } = recipeSlice.actions;
export const recipeSelector = (state: RootState) => state.recipes;
export default recipeSlice.reducer;
