import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RecipeData } from '../recipes/types';
import searchAPI from './searchApi';

interface ISearchListState {
  count: number;
  resultList: Array<RecipeData>;
  resultsLoading: boolean;
  resultsError: string;
}

const initialState: ISearchListState = {
  count: 0,
  resultList: [],
  resultsLoading: false,
  resultsError: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearResultsState: (state) => {
      state.count = 0;
      state.resultList = [];
      state.resultsError = '';
      state.resultsLoading = false;
      return state;
    },
  },
  extraReducers: (builder) => {},
});
export const { clearResultsState } = searchSlice.actions;
export const searchSelector = (state: RootState) => state.search;
export default searchSlice.reducer;
