import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ApprovalService from "../../../services/ApprovalService";

export const fetch = createAsyncThunk(
  "Approval/fetch",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.fetch(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createInit = createAsyncThunk(
  "Approval/createInit",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.createInit(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const create = createAsyncThunk(
  "Approval/create",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.create(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "Approval/update",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.update(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const changeStatus = createAsyncThunk(
  "Approval/changeStatus",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.changeStatus(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeRole = createAsyncThunk(
  "Approval/OnChangeRole",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.OnChangeRole(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeDepartment = createAsyncThunk(
  "Approval/OnChangeDepartment",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.OnChangeDepartment(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const sendPass = createAsyncThunk(
  "Approval/sendPass",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await ApprovalService.sendPass(data);
      return Approvals.data;
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
  HdrTable: null,
  StatusList: [],
  PlantList: [],
  DocumentList: [],
  ActivityList: [],
  LevelList: [],
  DetailList: [],
  ApprovalList: [],
  transtatus: [],
  RoleList: [],
  DepartmentList: [],
  PrimaryUserList: [],
  SecondaryUserList: [],
  SendPassHeader: [],
  SendPassDetail: [],
};
const approvalSlice = createSlice({
  name: "approval",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      state.createEditData = action.payload.data;
      state.HdrTable = null;
      state.DetailList = null;
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.ApprovalList = action.payload.ApprovalList;
      })
      .addCase(fetch.rejected, (state, action) => {
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
        state.StatusList = action.payload.StatusList;
        state.PlantList = action.payload.PlantList;
        state.DocumentList = action.payload.DocumentList;
        state.ActivityList = action.payload.ActivityList;
        state.LevelList = action.payload.LevelList;
        state.HdrTable = action.payload.HdrTable;
        state.DetailList = action.payload.DetailList;
        state.RoleList = action.payload.RoleList;
        state.DepartmentList = action.payload.DepartmentList;
        state.PrimaryUserList = action.payload.PrimaryUserList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(create.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(update.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateUpdateList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(update.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(changeStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(changeStatus.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(OnChangeRole.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeRole.fulfilled, (state, action: any) => {
        state.loading = false;
        state.PrimaryUserList = action.payload.PrimaryUserList;
      })
      .addCase(OnChangeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeDepartment.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeDepartment.fulfilled, (state, action: any) => {
        state.loading = false;
        state.PrimaryUserList = action.payload.PrimaryUserList;
      })
      .addCase(OnChangeDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPass.fulfilled, (state, action: any) => {
        state.loading = false;
        state.SendPassHeader = action.payload.VisitorEntryHeader;
        state.SendPassDetail = action.payload.VisitorEntryDetail;
      })
      .addCase(sendPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { createOrEdit } = approvalSlice.actions;

export default approvalSlice.reducer;
