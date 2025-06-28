import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as DepartmentService from "../../../services/DepartmentService";

export const CreateInitialize = createAsyncThunk(
  "department/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const department = await DepartmentService.CreateInitialize(data);

      return department.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const SearchInitialize = createAsyncThunk(
  "department/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const department = await DepartmentService.SearchInitialize(data);

      return department.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Create = createAsyncThunk(
  "department/Create",
  async (data: any, { rejectWithValue }) => {
    try {
      const department = await DepartmentService.Create(data);

      return department.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Update = createAsyncThunk(
  "department/Update",
  async (data: any, { rejectWithValue }) => {
    try {
      const department = await DepartmentService.Update(data);

      return department.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChangeStatus = createAsyncThunk(
  "department/ChangeStatus",
  async (data: any, { rejectWithValue }) => {
    try {
      const department = await DepartmentService.ChangeStatus(data);

      return department.data;
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
  DepartmentList: [],
  departmentUpdateRes: null,
  departmentchangedstatusList: [],
  HdrTable: [],
};

const departmentSlice = createSlice({
  name: "department",
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
        state.UserList = action.payload.UserList;
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
        state.DepartmentList = action.payload.DepartmentList;
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
        state.departmentUpdateRes = action.payload.transtatus;
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
        state.departmentchangedstatusList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
      });
  },
});

export const { createOrEdit } = departmentSlice.actions;

export default departmentSlice.reducer;
