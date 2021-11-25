import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FamilyData, UserData } from './types';
import { RecipeData, RatingData } from '../recipes/types';
import userAPI from './userAPI';
import { RootState } from '../../app/store';

interface IUserState {
  families?: Array<FamilyData>;
  favoriteRecipes?: Array<RecipeData>;
  firstName: string | null;
  id: string;
  lastName: string | null;
  postedRecipes?: Array<RecipeData>;
  ratings?: Array<RatingData>;
  roles: Array<string>;
  username: string;
  loading: boolean;
  errorMessage: string | undefined;
}

interface IUserAPIError {
  statusCode: number;
  message: string;
  error?: string;
}
const initialState: IUserState = {
  families: [],
  favoriteRecipes: [],
  firstName: '',
  id: '',
  lastName: '',
  postedRecipes: [],
  ratings: [],
  roles: [],
  username: '',
  loading: false,
  errorMessage: '',
};

export const loadUserBase = createAsyncThunk<
  UserData,
  string,
  { rejectValue: IUserAPIError }
>('users/loadUser', async (username, thunkAPI) => {
  try {
    const response = (await userAPI.getBySinglePropertyValue(
      'username',
      username
    )) as any;
    return response.data[0] as UserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data as IUserAPIError);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearState: (state) => {
      state.families = [];
      state.favoriteRecipes = [];
      state.firstName = '';
      state.id = '';
      state.lastName = '';
      state.postedRecipes = [];
      state.ratings = [];
      state.roles = [];
      state.username = '';
      state.loading = false;
      state.errorMessage = '';
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserBase.fulfilled, (state, { payload }) => {
        state.firstName = payload.firstName;
        state.id = payload.id;
        state.lastName = payload.lastName;
        state.roles = payload.roles;
        state.username = payload.username;
        state.loading = false;
        state.errorMessage = '';
        return state;
      })
      .addCase(loadUserBase.pending, (state, { payload }) => {
        state.loading = true;
        return state;
      })
      .addCase(loadUserBase.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.message;
        return state;
      })
      .addDefaultCase((state) => {});
  },
});

export const { clearState } = userSlice.actions;
export const userSelector = (state: RootState) => state.user;
export default userSlice.reducer;
