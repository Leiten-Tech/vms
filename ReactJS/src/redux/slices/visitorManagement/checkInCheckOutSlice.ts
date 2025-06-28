// checkInCheckOutSlice
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as CheckInCheckOutService from "../../../services/CheckInCheckOutService";
export const CheckOut = createAsyncThunk(
  "checkincheckout/CheckOut",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.CheckOut(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const CheckIn = createAsyncThunk(
  "checkincheckout/CheckIn",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.CheckIn(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const CheckOutWp = createAsyncThunk(
  "checkincheckout/CheckOutWp",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.CheckOutWp(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const CheckInWp = createAsyncThunk(
  "checkincheckout/CheckInWp",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.CheckInWp(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const CheckInCkeckoutPageLoad = createAsyncThunk(
  "checkincheckout/CheckinCkeckoutPageLoad",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.CheckinCkeckoutPageLoad(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const FilterVisitorEntryCodeManual = createAsyncThunk(
  "checkincheckout/FilterVisitorEntryCodeManual",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.FilterVisitorEntryCodeManual(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const FilterVisitorEntryCode = createAsyncThunk(
  "checkincheckout/FilterVisitorEntryCode",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.FilterVisitorEntryCode(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const FilterWorkPermitCode = createAsyncThunk(
  "checkincheckout/FilterWorkPermitCode",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.FilterWorkPermitCode(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVisitorEntryCode = createAsyncThunk(
  "checkincheckout/OnChangeVisitorEntryCode",
  async (data: any, thunkAPI) => {
    try {
      const states = await CheckInCheckOutService.OnChangeVisitorEntryCode(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
const Initialize = {
  isCreate: true,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  tranStatus: null,
  DtoEmployeeList: [],
  DtoDepartmentList: [],
  DtoStatusList: [],
  DtoTitleList: [],
  DtoIsPreBookingList: [],
  DtoVisitorTypeList: [],
  DtoProofList: [],
  DtoVisitorEntryTypeList: [],
  DtoVisitorEntryHeader: null,
  DtoVisitorEntryDetail: [],
  DtoVisitorEntryBelongingDetail: [],
  DtoVisitorEntryMaterialDetail: [],
  DtoVisitorEntryList: [],
  DtoVisitorEntryCodeList: [],
  DtoVisitorEmployeeList: [],
  DtoVisitorNameList: [],
  DtoVisitorWorkerList: [],
  DtoPreBookingList: [],
  DtoPartyTypeList: [],
  DtoAreaList: [],
  DtoRouteList: [],
  DtoPartyNameList: [],
  DtoDriverList: [],
  DtoVehicleList: [],
  DtoMaterialList: [],
  VisitorEntryLogList: [],
  CheckInOutList: [],
};
const checkInCheckOutSlice = createSlice({
  name: "checkincheckout",
  initialState: Initialize,
  reducers: {
    createOrEdit: (state: any, action) => {
      if (action.payload != null) {
        state.DtoVisitorEntryHeader = null;
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CheckOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckOut.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(CheckOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(CheckIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckIn.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(CheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(CheckInCkeckoutPageLoad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckInCkeckoutPageLoad.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CheckInOutList = action.payload.VisitorEntryLogList;
      })
      .addCase(CheckInCkeckoutPageLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(FilterVisitorEntryCodeManual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FilterVisitorEntryCodeManual.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(FilterVisitorEntryCodeManual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(FilterVisitorEntryCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FilterVisitorEntryCode.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(FilterVisitorEntryCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(FilterWorkPermitCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FilterWorkPermitCode.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(FilterWorkPermitCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeVisitorEntryCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangeVisitorEntryCode.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(OnChangeVisitorEntryCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { createOrEdit } = checkInCheckOutSlice.actions;
export default checkInCheckOutSlice.reducer;
