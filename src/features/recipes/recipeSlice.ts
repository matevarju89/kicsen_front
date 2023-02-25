import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RecipeData } from './types';
import recipeAPI, { recipeCategories } from './recipeApi';
import { RecipePayloadData } from './recipeAdd';
import { SmartTagData } from '../smartTag/types';

interface IRecipeListState {
  count: number;
  filteredCount: number;
  recipeList: Array<RecipeData>;
  current_smarttag_list: Array<SmartTagData>;
  recipeDetail: RecipeData | null;
  recipesLoading: boolean;
  recipesError: string;
  recipeDetailLoading: boolean;
  recipeDetailError: string | undefined;
}

const initialState: IRecipeListState = {
  count: 0,
  filteredCount: 0,
  recipeList: [],
  current_smarttag_list: [],
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

export const addRecipe = createAsyncThunk(
  'recipes/add',
  async (recipe: RecipePayloadData) => {
    const response = (await recipeAPI.create(recipe)) as any;
    if (response.status === 200) {
      return response.data as RecipeData;
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async ({ recipe, id }: { recipe: RecipePayloadData; id: string }) => {
    const response = (await recipeAPI.update(recipe, id)) as any;
    if (response.status === 200) {
      return response.data as RecipeData;
    }
  }
);

export const loadFirstRecipesOfCategories = createAsyncThunk(
  'recipes/getfirstrecipesofcategories',
  async (family: string) => {
    let results: any = [];
    const promises = recipeCategories.map(async (category) => {
      const response = (await recipeAPI.getfirstRecipesOfCategory(
        8,
        category,
        family
      )) as any;
      if (response.status === 200) {
        results = [...results, ...response.data];
      }
    });
    await Promise.all(promises);
    return results;
  }
);

export const numberOfResultsPerPage = 12;

export const loadCategoryPaginated = createAsyncThunk(
  'recipes/getcategory',
  async (arg: any) => {
    const response = (await recipeAPI.getBySinglePropertyValuePaginated(
      'category1',
      arg.category,
      numberOfResultsPerPage,
      arg.fromIndex,
      arg.family
    )) as any;
    if (response.status === 200) {
      return response.data as RecipeData[];
    }
  }
);

export const loadWithFiltersPaginated = createAsyncThunk(
  'recipes/getRecipesWithFilters',
  async (arg: any) => {
    const response = (await recipeAPI.getByMultiplePropertyValuesPaginated(
      arg.filterObject,
      numberOfResultsPerPage,
      arg.fromIndex,
      arg.family
    )) as any;
    if (response.status === 200) {
      //console.log(response.data);
      return response.data as RecipeData[];
    }
  }
);

export const loadFilteredMeta = createAsyncThunk(
  'recipes/getFilteredMeta',
  async (arg: any) => {
    const response = await recipeAPI.getFilteredMeta(
      arg.filterObject,
      arg.category,
      arg.family
    );
    if (response.status === 200) {
      return response.data;
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearRecipeDetailState: (state) => {
      state.recipeList = [];
      state.recipeDetail = null;
      state.recipeDetailError = '';
      state.current_smarttag_list = [];
      return state;
    },
    clearRecipeState: (state) => {
      state.recipeList = [];
      state.current_smarttag_list = [];
      state.recipeDetail = null;
      state.recipeDetailError = '';
      state.count = 0;
      state.recipesLoading = false;
      state.recipesError = '';
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilteredMeta.fulfilled, (state, { payload }) => {
        state.filteredCount = payload?.count ? payload.count : 0;
        state.current_smarttag_list =
          typeof payload?.smartTags !== 'undefined' ? payload?.smartTags : [];
        return state;
      })
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
        state.recipeList = [...(payload as RecipeData[])];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
        return state;
      })
      .addCase(loadWithFiltersPaginated.fulfilled, (state, { payload }) => {
        state.recipeList = [...(payload as RecipeData[])];
        state.recipesLoading = false;
        state.count = payload ? payload.length : 0;
        state.recipesError = '';
        return state;
      })
      .addCase(loadWithFiltersPaginated.rejected, (state, action) => {
        state.recipesError = 'Failed loading the recipes';
        state.recipeList = [];
        state.recipesLoading = false;
        return state;
      })
      .addCase(loadWithFiltersPaginated.pending, (state, action) => {
        state.recipesLoading = true;
        state.recipesError = '';
        state.recipeList = [];
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
export const { clearRecipeDetailState, clearRecipeState } = recipeSlice.actions;
export const recipeSelector = (state: RootState) => state.recipes;
export default recipeSlice.reducer;
