import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as StateService from "../../../../services/StateService";

export const fetchStates = createAsyncThunk(
  "state/fetchStates",
  async (data: any, { rejectWithValue }) => {
    try {
      const states = await StateService.fetchStates(data);

      return states.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "state/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await StateService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createStates = createAsyncThunk(
  "state/createStates",
  async (data: any, thunkAPI) => {
    try {
      const states = await StateService.createStates(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateStates = createAsyncThunk(
  "state/updateStates",
  async (data: any, thunkAPI) => {
    try {
      const states = await StateService.updateStates(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteStates = createAsyncThunk(
  "state/deleteStates",
  async (data: any, thunkAPI) => {
    try {
      const states = await StateService.deleteStates(data);
      return states.data;
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
  StatusList: [],
  CountryList: [],
  HdrTable: [],
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      

      state.createEditData = action.payload;
      state.isCreate = action.payload != null ? false : true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action: any) => {
        state.loading = false;
        state.StateList = action.payload.StateList;
      })
      .addCase(fetchStates.rejected, (state, action) => {
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
        state.CountryList = action.payload.CountryList;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(createStates.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(updateStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateUpdateList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(updateStates.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(deleteStates.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = stateSlice.actions;

export default stateSlice.reducer;
