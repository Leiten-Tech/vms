import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as VisitorEntryService from "../../../services/VisitorEntryService";
export const fetch = createAsyncThunk(
  "visitorentry/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createInit = createAsyncThunk(
  "visitorentry/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVisitorType = createAsyncThunk(
  "visitorentry/OnChangeVisitorType",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.OnChangeVisitorType(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVisitor = createAsyncThunk(
  "visitorentry/OnChangeVisitor",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.OnChangeVisitor(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangePartyType = createAsyncThunk(
  "visitorentry/OnChangePartyType",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.OnChangePartyType(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const create = createAsyncThunk(
  "visitorentry/create",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.create(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "visitorentry/update",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.update(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const changestatus = createAsyncThunk(
  "visitorentry/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await VisitorEntryService.changestatus(data);
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
  DtoPurposeList: [],
  DtoVisitorEntryPovDetail: [],
  DtoPlantList: [],
};
const visitorentrySlice = createSlice({
  name: "visitorentry",
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
      .addCase(update.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tranStatus = action.payload.tranStatus;
      })
      .addCase(update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeVisitorType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangeVisitorType.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(OnChangeVisitorType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeVisitor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangeVisitor.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(OnChangeVisitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangePartyType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangePartyType.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(OnChangePartyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInit.fulfilled, (state, action: any) => {
        state.loading = false;
        state.DtoVisitorTypeList = action.payload.VisitorTypeList;
        state.DtoIsPreBookingList = action.payload.IsPreBookingList;
        state.DtoProofList = action.payload.ProofList;
        state.DtoStatusList = action.payload.StatusList;
        state.DtoTitleList = action.payload.TitleList;
        state.DtoEmployeeList = action.payload.EmployeeList;
        state.DtoDepartmentList = action.payload.DepartmentList;
        state.DtoVisitorNameList = action.payload.VisitorNameList;
        state.DtoPartyTypeList = action.payload.PartyTypeList;
        state.DtoAreaList = action.payload.AreaList;
        state.DtoRouteList = action.payload.RouteList;
        state.DtoDriverList = action.payload.DriverList;
        state.DtoVehicleList = action.payload.VehicleList;
        state.DtoMaterialList = action.payload.MaterialList;
        state.DtoVisitorEntryHeader = action.payload.VisitorEntryHeader;
        state.DtoVisitorEntryDetail = action.payload.VisitorEntryDetail;
        state.DtoVisitorEntryBelongingDetail =
          action.payload.VisitorEntryBelongingDetail;
        state.DtoVisitorEntryMaterialDetail =
          action.payload.VisitorEntryMaterialDetail;
        state.DtoPurposeList = action.payload.PurposeList;
        state.DtoVisitorEntryPovDetail = action.payload.VisitorEntryAtvDetail;
        state.DtoPlantList = action.payload.PlantList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { createOrEdit } = visitorentrySlice.actions;
export default visitorentrySlice.reducer;
