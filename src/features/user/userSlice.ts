import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FamilyData, UserData } from './types';
import { RecipeData, RatingData } from '../recipes/types';
import userAPI from './userAPI';
import { RootState } from '../../app/store';
import Cookies from 'universal-cookie';
import { string } from 'yup';

interface IUserState {
  families?: Array<FamilyData>;
  //currentFamily: FamilyData | null;
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
  lang: string;
}

interface IUserAPIError {
  statusCode: number;
  message: string;
  error?: string;
}

//const cookies = new Cookies();

const defaultLanguage = window.localStorage.getItem('language')
  ? (window.localStorage.getItem('language') as string)
  : 'Hu';

/*const currentFamilyCookie = cookies.get('cur_fam')
  ? cookies.get('cur_fam')
  : '';*/
const currentFamily_from_storage = window.localStorage.getItem('cur_fam')
  ? (window.localStorage.getItem('cur_fam') as string)
  : '';

const initialState: IUserState = {
  families: [],
  //currentFamily: null,
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
  lang: defaultLanguage,
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
    if (response.status === 200) {
      const familyResponse = await userAPI.getUserFamilies(response.data[0].id);
      //console.log('response from server', familyResponse);
      response.data[0].families = familyResponse.data;
      //console.log('families from server', response.data[0].families);
    }
    return response.data[0] as UserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data as IUserAPIError);
  }
});

export const loadUserFamily = createAsyncThunk(
  'users/loadFamily',
  async (id: string) => {
    try {
      const response = await userAPI.getUserFamilies(id);
      return response.data as FamilyData[];
    } catch (err: any) {
      throw err;
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearState: (state) => {
      state.families = [];
      //state.currentFamily = null;
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
    setLang: (state, { payload }) => {
      state.lang = payload?.lang ? payload.lang : 'Hu';
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserBase.fulfilled, (state, { payload }) => {
        /*console.log('payload', payload);
        const currentFamily =
          !!currentFamilyCookie && !!payload.families
            ? payload.families.filter(
                (fam) => (fam.id = currentFamilyCookie)
              )[0]
            : null;
        console.log('currentFamily', currentFamily);*/
        state.firstName = payload.firstName;
        state.families = payload.families;
        /*state.currentFamily =
          currentFamilyCookie && payload.families
            ? payload.families.filter(
                (fam) => (fam.id = currentFamilyCookie)
              )[0]
            : payload.families
            ? payload.families[0]
            : null;*/
        /*console.log(
          'showing state',
          !!currentFamilyCookie && !!payload.families,
          payload.families?.filter((fam) => (fam.id = currentFamilyCookie))[0],
          payload.families
        );*/
        state.id = payload.id;
        state.lastName = payload.lastName;
        state.roles = payload.roles;
        state.username = payload.username;
        state.loading = false;
        state.errorMessage = '';
        state.lang = defaultLanguage;
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

export const { clearState, setLang } = userSlice.actions;
export const userSelector = (state: RootState) => state.user;
export default userSlice.reducer;
