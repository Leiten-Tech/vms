import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as UserService from "../../../services/UserService";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (data: any, { rejectWithValue }) => {
    try {
      const users = await UserService.fetchUsers(data);
      return users.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "user/createInit",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.createInit(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createUsers = createAsyncThunk(
  "user/createUsers",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.createUsers(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const ScreenMapping = createAsyncThunk(
  "user/ScreenMapping",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.ScreenMapping(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeCompany = createAsyncThunk(
  "user/OnChangeCompany",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.OnChangeCompany(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangePlant = createAsyncThunk(
  "user/OnChangePlant",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.OnChangePlant(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUsers = createAsyncThunk(
  "user/updateUsers",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.updateUsers(data);
      return users.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "user/deleteUsers",
  async (data: any, thunkAPI) => {
    try {
      const users = await UserService.deleteUsers(data);
      return users.data;
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
  StatusList: [],
  UserList: [],
  HdrTable: null,
  EmployeeList: [],
  CompanyList: [],
  RoleList: [],
  PlantList: [],
  GateList:[],
  UserRoleMapList: [],
  UserCompanyMapList: [],
  UserPlantMapList: [],
  transtatus:[],
  DepartmentList:[]
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      
      state.createEditData = action.payload.data;
      state.HdrTable = null
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(OnChangePlant.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangePlant.fulfilled, (state, action: any) => {
        state.loading = false;
        state.GateList = action.payload.GateList;
      })
      .addCase(OnChangePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: any) => {
        state.loading = false;
        state.UserList = action.payload.UserList;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
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
        // if (!action.payload) {
        state.StatusList = action.payload.StatusList;
        state.EmployeeList = action.payload.EmployeeList;
        state.CompanyList = action.payload.CompanyList;
        state.RoleList = action.payload.RoleList;
        state.HdrTable = action.payload.HdrTable;
        state.PlantList = action.payload.PlantList;
        state.GateList = action.payload.GateList;
        state.UserRoleMapList = action.payload.UserRoleMapList;
        state.UserCompanyMapList = action.payload.UserCompanyMapList;
        state.UserPlantMapList = action.payload.UserPlantMapList;
        state.UserGateMapList = action.payload.UserGateMapList;
        state.DepartmentList = action.payload.DepartmentList;
        // }
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transtatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(createUsers.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(ScreenMapping.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ScreenMapping.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transtatus = action.payload.transtatus;
        state.error = "";
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(ScreenMapping.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(updateUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateUpdateList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(updateUsers.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(deleteUsers.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      });
  },
});


export const { createOrEdit } = userSlice.actions;

export default userSlice.reducer;
