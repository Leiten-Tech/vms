import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as VendorRegService from "../../../services/VendorRegService";

export const createInit = createAsyncThunk(
  "vendorReg/createInit",
  async (data: any, thunkAPI) => {
    try {
      const result = await VendorRegService.createInit(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const create = createAsyncThunk(
  "vendorReg/create",
  async (data: any, thunkAPI) => {
    try {
      const result = await VendorRegService.create(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "vendorReg/update",
  async (data: any, thunkAPI) => {
    try {
      const result = await VendorRegService.update(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetch = createAsyncThunk(
  "vendorReg/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await VendorRegService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const changestatus = createAsyncThunk(
  "vendorReg/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await VendorRegService.changestatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const Initialize = {
  isCreate: true,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  WorkOrganiser: [],
  WorkerStatusList: [],
  CompanyDocs: [],
  WorkDocTypesSlice: [],
  VendorRegHeader: [],
  WpWorkerDetail: [],
  WpCompanyDocDetail: [],
  WpWorkerDocDetail: [],
  tranStatus: null,
};
const vendorRegSlice = createSlice({
  name: "vendorReg",
  initialState: Initialize,
  reducers: {
    createOrEdit: (state: any, action) => {
      if (action.payload != null) {
        state.createEditData = action.payload.data;
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
        state.WorkOrganiser = action.payload.WorkOrganiser;
        state.WorkerStatusList = action.payload.WorkerStatusList;
        state.CompanyDocs = action.payload.CompanyDocs;
        state.WorkDocTypesSlice = action.payload.WorkDocs;
        state.VendorRegHeader = action.payload.VendorRegHeader;
        state.WpWorkerDetail = action.payload.WpWorkerDetail;
        state.WpWorkerDocDetail = action.payload.WpWorkerDocDetail;
        state.WpCompanyDocDetail = action.payload.WpCompanyDocDetail;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state, action: any) => {
        state.loading = false;
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
        state.VendorRegList = action.payload.VendorRegList;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { createOrEdit } = vendorRegSlice.actions;
export default vendorRegSlice.reducer;
