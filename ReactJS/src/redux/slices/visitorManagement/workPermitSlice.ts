import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as WorkPermitService from "../../../services/WorkPermitService";

export const createInit = createAsyncThunk(
  "workPermit/createInit",
  async (data: any, thunkAPI) => {
    try {
      const result = await WorkPermitService.createInit(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const create = createAsyncThunk(
  "workPermit/create",
  async (data: any, thunkAPI) => {
    try {
      const result = await WorkPermitService.create(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "workPermit/update",
  async (data: any, thunkAPI) => {
    try {
      const result = await WorkPermitService.update(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateImage = createAsyncThunk(
  "workPermit/updateImage",
  async (data: any, thunkAPI) => {
    try {
      const result = await WorkPermitService.updateImage(data);
      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetch = createAsyncThunk(
  "workPermit/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const changestatus = createAsyncThunk(
  "workPermit/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.changestatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const fetchVendor = createAsyncThunk(
  "workPermit/fetchVendor",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.fetchVendor(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const onChangeVendor = createAsyncThunk(
  "workPermit/onChangeVendor",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.onChangeVendor(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const fetchCheckPoints = createAsyncThunk(
  "workPermit/fetchCheckPoints",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.fetchCheckPoints(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const GetWpPass = createAsyncThunk(
  "workPermit/GetWpPass",
  async (data: any, thunkAPI) => {
    try {
      const states = await WorkPermitService.GetWpPass(data);
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
  WorkDocs: [],
  WorkPermitHeader: [],
  WpWorkerDetail: [],
  WpCategoryDetail: [],
  WpWorkerDocDetail: [],
  WpVendorList: [],
  tranStatus: null,
};
const workPermitSlice = createSlice({
  name: "workPermit",
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
        state.WorkDocs = action.payload.WorkDocs;
        state.WorkPermitHeader = action.payload.WorkPermitHeader;
        state.WpWorkerDetail = action.payload.WpWorkerDetail;
        state.WpWorkerDocDetail = action.payload.WpWorkerDocDetail;
        state.WpCategoryDetail = action.payload.WpCategoryDetail;
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
      .addCase(fetchVendor.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchVendor.fulfilled, (state, action: any) => {
        state.loading = false;
        state.WpVendorList = action.payload.WpVendorList;
      })
      .addCase(fetchVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(onChangeVendor.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(onChangeVendor.fulfilled, (state, action: any) => {
        state.loading = false;
        state.VendorWorkersList = action.payload.VendorWorkersList;
      })
      .addCase(onChangeVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCheckPoints.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCheckPoints.fulfilled, (state, action: any) => {
        state.loading = false;
        state.WpCheckPoints = action.payload.WpCheckPoints;
      })
      .addCase(fetchCheckPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetWpPass.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(GetWpPass.fulfilled, (state, action: any) => {
        state.loading = false;
        state.WpPassHead = action.payload.WpPassHead;
      })
      .addCase(GetWpPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.WorkPermitList = action.payload.WorkPermitList;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { createOrEdit } = workPermitSlice.actions;
export default workPermitSlice.reducer;
