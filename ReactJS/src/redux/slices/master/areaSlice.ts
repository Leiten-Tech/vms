import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as AreaService from "../../../services/AreaService";

export const CreateInitialize = createAsyncThunk(
  "area/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.CreateInitialize(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const OnChangeCompany = createAsyncThunk(
  "area/OnChangeCompany",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.OnChangeCompany(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const SearchInitialize = createAsyncThunk(
  "area/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.SearchInitialize(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Create = createAsyncThunk(
  "area/Create",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.Create(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Update = createAsyncThunk(
  "area/Update",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.Update(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChangeStatus = createAsyncThunk(
  "area/ChangeStatus",
  async (data: any, { rejectWithValue }) => {
    try {
      const area = await AreaService.ChangeStatus(data);

      return area.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: true,
  createEditData: null,
  loading: false,
  error: null,
  createTranstatus: null,
  StatusList: [],
  AreaList: [],
  CompanyList:[],
  PlantList:[],
  Area: [],
  areaUpdateRes: null,
  areachangedstatusList: [],
  HdrTable: [],
};

const areaSlice = createSlice({
  name: "area",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      state.createEditData = action.payload.data;
      state.HdrTable = null;
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateInitialize.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.StatusList = action.payload.StatusList;
        state.CompanyList = action.payload.CompanyList;
        state.PlantList = action.payload.PlantList;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeCompany.pending, (state) => {
        state.loading = false;
        state.error = null;
    })
    .addCase(OnChangeCompany.fulfilled, (state, action: any) => {
        state.loading = false;
        state.PlantList = action.payload.PlantList;
    })
    .addCase(OnChangeCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
      .addCase(SearchInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchInitialize.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.AreaList = action.payload.AreaList;
      })
      .addCase(SearchInitialize.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(Create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Create.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(Create.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(Update.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Update.fulfilled, (state, action) => {
        state.loading = false;
        state.areaUpdateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(Update.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(ChangeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.areachangedstatusList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
      });
  },
});

export const { createOrEdit } = areaSlice.actions;

export default areaSlice.reducer;
