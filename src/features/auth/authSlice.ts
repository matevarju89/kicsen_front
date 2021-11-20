import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AppDispatch } from '../../app/store';
import { AuthenticatedUserData, AuthPayloadData } from './types';
import AuthAPI from './authAPI';
import setUser from '../../utility/setUser';

interface IAuthState {
  username: string;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  isAuthenticated: boolean;
}
interface LoginError {
  statusCode: number;
  message: string;
  error: string;
}
const initialState: IAuthState = {
  username: '',
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk<
  AuthenticatedUserData,
  AuthPayloadData,
  {
    rejectValue: LoginError;
  }
>('users/login', async ({ username, password }, thunkApi) => {
  try {
    const response = (await AuthAPI.login({
      username,
      password,
    })) as any;
    setUser({
      token: response.data.accessToken,
      username: response.data.username,
    });
    return response.data as AuthenticatedUserData;
  } catch (err: any) {
    return thunkApi.rejectWithValue(err.response.data as LoginError);
  }
});

export const logoutUser = () => (dispatch: AppDispatch) => {
  setUser(null);
  dispatch(logout());
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.errorMessage = '';
      return state;
    },
    userIdentified: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isAuthenticated = true;
      return state;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.username = payload.username;
        state.isAuthenticated = true;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        if (payload?.message) {
          state.errorMessage = payload.message;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
      })
      .addDefaultCase((state) => {});
  },
});
export const authSelector = (state: RootState) => state.auth;
export const { clearState, userIdentified, logout } = authSlice.actions;

export default authSlice.reducer;
