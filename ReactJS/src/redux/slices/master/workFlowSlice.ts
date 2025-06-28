import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as WorkFlowService from "../../../services/WorkFlowService";

export const fetch = createAsyncThunk(
  "WorkFlow/fetch",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.fetch(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const ApprovalView = createAsyncThunk(
  "WorkFlow/ApprovalView",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.ApprovalView(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const approvalUpdateLevel = createAsyncThunk(
  "WorkFlow/approvalUpdateLevel",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.approvalUpdateLevel(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const approvalupdate = createAsyncThunk(
  "WorkFlow/approvalupdate",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.approvalupdate(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const mailApproval = createAsyncThunk(
  "WorkFlow/mailApproval",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.mailApproval(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const EncryptData = createAsyncThunk(
  "WorkFlow/Encrypt",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.EncryptData(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const DecryptData = createAsyncThunk(
  "WorkFlow/DecryptData",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.DecryptData(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const DSendPass = createAsyncThunk(
  "WorkFlow/DSendPass",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.DSendPass(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const checkOutTimer = createAsyncThunk(
  "WorkFlow/checkOutTimer",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.CheckOutTimer(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const poppupFetch = createAsyncThunk(
  "WorkFlow/poppupFetch",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.poppupfetch(data);
      return WorkFlows.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const poppupUpdate = createAsyncThunk(
  "WorkFlow/poppupUpdate",
  async (data: any, thunkAPI) => {
    try {
      const WorkFlows = await WorkFlowService.poppupupdate(data);
      return WorkFlows.data;
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
  WorkFlowList: [],
};
const workFlowSlice = createSlice({
  name: "workFlow",
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
      .addCase(fetch.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.WorkFlowList = action.payload.WorkFlowList;
        state.workFlowCountList = action.payload.workFlowCountList;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(ApprovalView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ApprovalView.fulfilled, (state, action: any) => {
        state.loading = false;
        state.ApprovalViewList = action.payload.ApprovalViewList;
      })
      .addCase(ApprovalView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approvalupdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvalupdate.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(approvalupdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approvalUpdateLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvalUpdateLevel.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(approvalUpdateLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mailApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mailApproval.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(mailApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkOutTimer.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(checkOutTimer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(checkOutTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(poppupFetch.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(poppupFetch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(poppupFetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(poppupUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(poppupUpdate.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(poppupUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { createOrEdit } = workFlowSlice.actions;

export default workFlowSlice.reducer;
