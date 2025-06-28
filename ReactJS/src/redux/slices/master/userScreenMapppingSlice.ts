import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as UserScreenMappingService from "../../../services/userScreenMappingService";

export const getTable = createAsyncThunk(
  "userScreenMapping/fetchUserScreenMapping",
  async (data: any, { rejectWithValue }) => {
    try {
      const states = await UserScreenMappingService.getTable(data);

      return states.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "userScreenMapping/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await UserScreenMappingService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const GetUser = createAsyncThunk(
  "userScreenMapping/createUserScreenMapping",
  async (data: any, thunkAPI) => {
    try {
      const states = await UserScreenMappingService.GetUser(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const saveUserScreen = createAsyncThunk(
  "userScreenMapping/saveUserScreen",
  async (data: any, thunkAPI) => {
    try {
      const states = await UserScreenMappingService.saveUserScreen(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteUserScreenMapping = createAsyncThunk(
  "userScreenMapping/deleteUserScreenMapping",
  async (data: any, thunkAPI) => {
    try {
      const states = await UserScreenMappingService.deleteUserScreenMapping(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: false,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  UserScreens: null,
  ModuleList: null,
  RoleMasterList: null,
  UserList: null,
};

const userScreenMappingSlice = createSlice({
  name: "userScreenMappingSlice",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      
      state.createEditData = action.payload.data;
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTable.fulfilled, (state, action: any) => {
        state.loading = false;
        state.UserScreens = action.payload.UserScreens;
      })
      .addCase(getTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInit.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.ModuleList = action.payload.ModuleList;
        state.RoleMasterList = action.payload.RoleMasterList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetUser.fulfilled, (state, action) => {
        state.loading = false;
        state.UserList = action.payload.UserList;
        state.error = "";
      })
      .addCase(GetUser.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(saveUserScreen.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveUserScreen.fulfilled, (state, action) => {
        state.loading = false;
        state.companyUpdateList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(saveUserScreen.rejected, (state, action: any) => {
        state.loading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteUserScreenMapping.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserScreenMapping.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.companyDeletedList = action.payload.transtatus;
      })
      .addCase(deleteUserScreenMapping.rejected, (state, action: any) => {
        state.loading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = userScreenMappingSlice.actions;

export default userScreenMappingSlice.reducer;
