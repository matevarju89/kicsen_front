import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SmartTagData, SmartTagDao } from './types';
import smartTagAPI, { CreateManyBatchResponse } from './smartTagAPI';

interface ISmartTagsListState {
  count: number;
  smartTagList: Array<SmartTagData>;
  smartTagsLoading: boolean;
  smartTagsError: string;
}

const initialState: ISmartTagsListState = {
  count: 0,
  smartTagList: [],
  smartTagsLoading: false,
  smartTagsError: '',
};

export const loadAllSmartTags = createAsyncThunk(
  'smartTags/getall',
  async (family: string) => {
    const response = (await smartTagAPI.getAll(family)) as any;
    if (response.status === 200) {
      return response.data as SmartTagData[];
    }
  }
);

export const loadAllSmartTagsByLang = createAsyncThunk(
  'smartTags/getallByLang',
  async (lang: string) => {
    const response = (await smartTagAPI.getAllByLang(lang)) as any;
    if (response.status === 200) {
      return response.data as SmartTagData[];
    }
  }
);

export const loadSmartTag = createAsyncThunk(
  'smartTags/get',
  async (id: string, { rejectWithValue }) => {
    const response = (await smartTagAPI.get(id)) as any;
    //if (response.status === 200) {
    return response.data as SmartTagData;
    //}
  }
);

export const addSmartTag = createAsyncThunk(
  'smartTags/add',
  async (smartTag: SmartTagDao) => {
    const response = (await smartTagAPI.create(smartTag)) as any;
    if (response.status === 201) {
      return response.data as SmartTagData;
    }
  }
);

export const updateSmartTag = createAsyncThunk(
  'smartTags/update',
  async ({ smartTag, id }: { smartTag: SmartTagDao; id: string }) => {
    const response = (await smartTagAPI.update(smartTag, id)) as any;
    if (response.status === 200) {
      return response.data as SmartTagData;
    }
  }
);

export const uploadSmartTags = createAsyncThunk(
  'smartTags/uploadMany',
  async (smartTags: SmartTagDao[]) => {
    const response = (await smartTagAPI.createMany(smartTags)) as any;
    if (response.status === 201) {
      return response.data as CreateManyBatchResponse;
    }
  }
);

export const numberOfResultsPerPage = 10;

export const loadSmartTagsByLanguagePaginated = createAsyncThunk(
  'smartTags/getSmartTagsByLanguagePaginated',
  async (arg: any) => {
    const response = (await smartTagAPI.getByLanguagePaginated(
      arg.lang,
      numberOfResultsPerPage
    )) as any;
    if (response.status === 200) {
      return response.data as SmartTagData[];
    }
  }
);

export const smartTagSlice = createSlice({
  name: 'smartTags',
  initialState,
  reducers: {
    clearSmartTagListState: (state) => {
      state.smartTagList = [];
      state.smartTagsError = '';
      state.count = 0;
      state.smartTagsLoading = false;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllSmartTags.fulfilled, (state, { payload }) => {
        state.smartTagList = payload as SmartTagData[];
        state.smartTagsLoading = false;
        state.count = payload ? payload.length : 0;
        state.smartTagsError = '';
        return state;
      })
      .addCase(loadSmartTag.fulfilled, (state, { payload }) => {
        state.smartTagList = [payload as SmartTagData];
        state.smartTagsLoading = false;
        state.count = 1;
        state.smartTagsError = '';
        return state;
      })
      .addCase(
        loadSmartTagsByLanguagePaginated.fulfilled,
        (state, { payload }) => {
          state.smartTagList = payload as SmartTagData[];
          state.smartTagsLoading = false;
          state.count = payload ? payload.length : 0;
          state.smartTagsError = '';
          return state;
        }
      )
      .addCase(loadAllSmartTagsByLang.fulfilled, (state, { payload }) => {
        state.smartTagList = payload as SmartTagData[];
        state.smartTagsLoading = false;
        state.count = payload ? payload.length : 0;
        state.smartTagsError = '';
        return state;
      })
      .addMatcher(
        isAnyOf(
          loadAllSmartTags.rejected,
          loadSmartTag.rejected,
          loadSmartTagsByLanguagePaginated.rejected,
          loadAllSmartTagsByLang.rejected
        ),
        (state, action) => {
          state.smartTagsError = 'Failed loading the SmartTags';
          state.smartTagsLoading = false;
          state.smartTagList = [];
          state.count = 0;
          return state;
        }
      )
      .addMatcher(
        isAnyOf(
          loadAllSmartTags.pending,
          loadSmartTag.pending,
          loadSmartTagsByLanguagePaginated.pending,
          loadAllSmartTagsByLang.pending
        ),
        (state, action) => {
          state.smartTagsLoading = true;
          return state;
        }
      );
  },
});
export const { clearSmartTagListState } = smartTagSlice.actions;
export const smartTagSelector = (state: RootState) => state.smartTags;
export default smartTagSlice.reducer;
