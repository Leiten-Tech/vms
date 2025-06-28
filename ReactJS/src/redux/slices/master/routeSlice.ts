import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as RouteService from "../../../services/RouteService";

export const CreateInitialize = createAsyncThunk(
  "route/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const route = await RouteService.CreateInitialize(data);

      return route.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const SearchInitialize = createAsyncThunk(
  "route/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const route = await RouteService.SearchInitialize(data);

      return route.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Create = createAsyncThunk(
  "route/Create",
  async (data: any, { rejectWithValue }) => {
    try {
      const route = await RouteService.Create(data);

      return route.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Update = createAsyncThunk(
  "route/Update",
  async (data: any, { rejectWithValue }) => {
    try {
      const route = await RouteService.Update(data);

      return route.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChangeStatus = createAsyncThunk(
  "route/ChangeStatus",
  async (data: any, { rejectWithValue }) => {
    try {
      const route = await RouteService.ChangeStatus(data);

      return route.data;
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
    RouteList:[],
    Route:[],
    routeUpdateRes: null,
    routechangedstatusList: [],
    HdrTable: [],
  };
  
  const routeSlice = createSlice({
    name: "route",
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
            state.RouteList = action.payload.RouteList;
           state.HdrTable = action.payload.HdrTable;
          })
          .addCase(CreateInitialize.rejected, (state, action) => {
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
            state.RouteList = action.payload.RouteList;
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
            state.routeUpdateRes = action.payload.transtatus;
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
            state.routechangedstatusList = action.payload.transtatus;
            state.error = "";
          })
          .addCase(ChangeStatus.rejected, (state, action: any) => {
            state.loading = false;
          });
      },
    });
    
    export const { createOrEdit } = routeSlice.actions;
    
    export default routeSlice.reducer;
    