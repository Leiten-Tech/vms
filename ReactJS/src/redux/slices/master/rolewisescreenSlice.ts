import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as roleScreenMappingService from "../../../services/RoleWiseScreenService";
export const CreateInitialize = createAsyncThunk(
  "rolewisescreenmapping/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const rolewisescreenmapping =
        await roleScreenMappingService.CreateInitialize(data);

      return rolewisescreenmapping.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Create = createAsyncThunk(
  "rolewisescreenmapping/Create",
  async (data: any, thunkAPI) => {
    try {
      const rolewisescreenmapping = await roleScreenMappingService.Create(data);
      return rolewisescreenmapping.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const GetFunctions = createAsyncThunk(
  "rolewisescreenmapping/GetFunctions",
  async (data: any, thunkAPI) => {
    try {
      const rolewisescreenmapping = await roleScreenMappingService.GetFunctions(
        data
      );
      return rolewisescreenmapping.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const GetDefaultModules = createAsyncThunk(
  "rolewisescreenmapping/GetDefaultModules",
  async (data: any, thunkAPI) => {
    try {
      const rolewisescreenmapping =
        await roleScreenMappingService.GetDefaultModules(data);
      return rolewisescreenmapping.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: false,
  createEditData: null,
  loading: false,
  error: null,
  createTranstatus: null,
  StatusList: [],
  AllScreens: [],
  FunctionRoleMapList: [],
  ModuleList: [],
  RoleMasterList: [],
  RolewiseScreenMappingViewList: [],
  HdrTable: [],
};

const roleWiseScreen = createSlice({
  name: "roleWiseScreen",
  initialState,
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
      .addCase(CreateInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateInitialize.fulfilled, (state, action: any) => {
        state.loading = false;
        state.RoleMasterList = action.payload.RoleMasterList;
        state.ModuleList = action.payload.ModuleList;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Create.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.StatusList = action.payload.StatusList;
        state.FunctionRoleMapList = action.payload.FunctionRoleMapList;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(Create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetFunctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetFunctions.fulfilled, (state, action) => {
        state.loading = false;
        state.AllScreens = action.payload.AllScreens;
        state.createTranstatus = action.payload.transtatus;
        state.RolewiseScreenMappingViewList =
          action.payload.RolewiseScreenMappingViewList;
        state.error = "";
      })
      .addCase(GetFunctions.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(GetDefaultModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetDefaultModules.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.AllScreens = action.payload.AllScreens;
        state.RolewiseScreenMappingViewList =
        action.payload.RolewiseScreenMappingViewList;
      })
      .addCase(GetDefaultModules.rejected, (state, action: any) => {
        state.loading = false;
      });
  },
});

export const { createOrEdit } = roleWiseScreen.actions;

export default roleWiseScreen.reducer;
