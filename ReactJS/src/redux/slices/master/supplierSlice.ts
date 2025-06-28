import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SupplierService from "../../../services/SupplierService";

const Initialize = {
  isCreate: true,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  StatusList: [],
  SupplierTypeList:[],
  SupplierCategoryList:[],
  SupplierHeader: [],
  SupplierDetail:[],
  CountryList: [],
  StateList: [],
  CityList: [],
  supplierDeletedList: [],
  StateUpdateRes: null,
};
export const fetch = createAsyncThunk(
  "supplier/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "supplier/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const create = createAsyncThunk(
  "supplier/create",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.create(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "supplier/update",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.update(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const changestatus = createAsyncThunk(
  "supplier/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.changestatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeCountry = createAsyncThunk(
  "supplier/OnChangeCountry",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.OnChangeCountry(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeState = createAsyncThunk(
  "supplier/OnChangeState",
  async (data: any, thunkAPI) => {
    try {
      const states = await SupplierService.OnChangeState(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: Initialize,
  reducers: {
    createOrEdit: (state: any, action) => {
      if (action.payload != null) {
        state.createEditData = action.payload.data;
        state.SupplierHeader = null;
        state.SupplierDetail = null;
        state.HdrTable=null;
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInit.fulfilled, (state, action: any) => {
        state.loading = false;
        state.SupplierTypeList = action.payload.SupplierTypeList;
        state.SupplierCategoryList = action.payload.CategoryList;
        state.StatusList = action.payload.StatusList;
        state.CountryList = action.payload.CountryList;
        state.StateList = action.payload.StateList;
        state.CityList = action.payload.CityList;
        state.SupplierHeader = action.payload.HdrTable;
        state.SupplierDetail = action.payload.DtlTable;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeCountry.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeCountry.fulfilled, (state, action: any) => {
        state.loading = false;
        state.StateList = action.payload.StateList;
        state.CityList = [];
      })
      .addCase(OnChangeCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeState.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeState.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CityList = action.payload.CityList;
      })
      .addCase(OnChangeState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tranStatus = action.payload.tranStatus;
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(update.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tranStatus = action.payload.tranStatus;
      })
      .addCase(update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.SupplierList = action.payload.SupplierList;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changestatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changestatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.supplierDeletedList = action.payload.transtatus;
      })
      .addCase(changestatus.rejected, (state, action: any) => {
        state.loading = false;
        });
  },
});
export const { createOrEdit } = supplierSlice.actions;

export default supplierSlice.reducer;
