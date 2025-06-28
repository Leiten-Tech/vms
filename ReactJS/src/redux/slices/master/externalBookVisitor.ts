import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ExternalBookVisitorService from "../../../services/ExternalBookVisitorService";

export const fetchVM = createAsyncThunk(
  "externalBookVisitor/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createInitVM = createAsyncThunk(
  "externalBookVisitor/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeCountryVM = createAsyncThunk(
  "externalBookVisitor/OnChangeCountry",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.OnChangeCountry(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeStateVM = createAsyncThunk(
  "externalBookVisitor/OnChangeState",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.OnChangeState(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createVM = createAsyncThunk(
  "externalBookVisitor/create",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.create(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateVM = createAsyncThunk(
  "externalBookVisitor/update",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.update(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const changestatusVM = createAsyncThunk(
  "externalBookVisitor/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorService.changestatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
const Initialize = {
  isCreateVM: true,
  isViewVM: false,
  createEditDataVM: null,
  loadingVM: false,
  errorVM: null,
  tranStatusVM: null,
  VisitorHeaderVM: null,
  VisitorTypeListVM: [],
  TitleListVM: [],
  IdCardListVM: [],
  StatusListVM: [],
  CountryListVM: [],
  StateListVM: [],
  CityListVM: [],
  DepartmentListVM: [],
  VisitorDetailVM: [],
  VisitorSearchListVM: [],
  WorkSeverityListVM: [],
  VisitorTypeSearchListVM: [],
};

const externalBookVisitorSlice = createSlice({
  name: "externalBookVisitor",
  initialState: Initialize,
  reducers: {
    createOrEdit: (state: any, action) => { 
      if (action.payload != null) {
        state.createEditData = action.payload.data;
        state.VisitorHeader = null;
        state.VisitorDetail = null;
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tranStatus = action.payload.tranStatus;
      })
      .addCase(updateVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tranStatus = action.payload.tranStatus;
      })
      .addCase(createVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.VisitorTypeSearchList = action.payload.VisitorTypeSearchList;
        state.VisitorSearchList = action.payload.VisitorSearchList;
      })
      .addCase(fetchVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInitVM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInitVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.VisitorTypeList = action.payload.VisitorTypeList;
        state.TitleListVM = action.payload.TitleList;
        state.IdCardList = action.payload.IdCardList;
        state.StatusList = action.payload.StatusList;
        state.WorkSeverityList = action.payload.WorkSeverityList;
        state.CountryList = action.payload.CountryList;
        state.DepartmentList = action.payload.DepartmentList;
        state.StateList = action.payload.StateList;
        state.CityList = action.payload.CityList;
        state.VisitorHeader = action.payload.VisitorHeader;
        state.VisitorDetail = action.payload.VisitorDetail;
      })
      .addCase(createInitVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeCountryVM.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeCountryVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.StateList = action.payload.StateList;
        state.CityList = [];
      })
      .addCase(OnChangeCountryVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeStateVM.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeStateVM.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CityList = action.payload.CityList;
      })
      .addCase(OnChangeStateVM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { createOrEdit } = externalBookVisitorSlice.actions;

export default externalBookVisitorSlice.reducer;
