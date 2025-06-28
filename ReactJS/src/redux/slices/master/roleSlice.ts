import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as RoleService from "../../../services/RoleService";

export const SearchInitialize = createAsyncThunk(
  "role/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const states = await RoleService.SearchInitialize(data);

      return states.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const CreateInitialize = createAsyncThunk(
  "role/CreateInitialize",
  async (data: any, thunkAPI) => {
    try {
      const states = await RoleService.CreateInitialize(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Create = createAsyncThunk(
  "role/Create",
  async (data: any, thunkAPI) => {
    try {
      const states = await RoleService.Create(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Update = createAsyncThunk(
  "role/Update",
  async (data: any, thunkAPI) => {
    try {
      const states = await RoleService.Update(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const ChangeStatus = createAsyncThunk(
  "role/ChangeStatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await RoleService.ChangeStatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: true,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  roleDeletedList: [],
  RoleCreateRes: null,
  RoleUpdateRes: null,
  StatusList: [],
  RoleList: [],
  HdrTable: [],
};

const roleSlice = createSlice({
  name: "roleSlice",
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
      .addCase(SearchInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchInitialize.fulfilled, (state, action: any) => {
        state.loading = false;
        state.RoleList = action.payload.RoleList;
      })
      .addCase(SearchInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(CreateInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateInitialize.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.StatusList = action.payload.StatusList;
        state.RoleList = action.payload.RoleMasterList;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Create.pending, (state) => {
        state.loading = true;
      })
      .addCase(Create.fulfilled, (state, action) => {
        state.loading = false;
        state.RoleCreateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(Create.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(Update.pending, (state) => {
        state.loading = true;
      })
      .addCase(Update.fulfilled, (state, action) => {
        state.loading = false;
        state.RoleUpdateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(Update.rejected, (state, action: any) => {
        state.loading = false;
       })
      .addCase(ChangeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.roleDeletedList = action.payload.transtatus;
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
       });
  },
});

export const { createOrEdit } = roleSlice.actions;

export default roleSlice.reducer;
