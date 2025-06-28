import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ExternalBookVisitorEntryService from "../../../services/ExternalBookVisitorEntryService";

export const fetch = createAsyncThunk(
  "externalBookEntry/fetch",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.fetch(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createInit = createAsyncThunk(
  "externalBookEntry/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnEnterMobileNo = createAsyncThunk(
  "externalBookEntry/onEnterMobileNo",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.onEnterMobileNo(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVisitorType = createAsyncThunk(
  "externalBookEntry/OnChangeVisitorType",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangeVisitorType(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const FilterVehicleNo = createAsyncThunk(
  "externalBookEntry/FilterVehicleNo",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.FilterVehicleNo(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const FilterDrive = createAsyncThunk(
  "externalBookEntry/FilterDriver",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.FilterDriver(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVehicleNo = createAsyncThunk(
  "externalBookEntry/OnChangeVehicleNo",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangeVehicleNo(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeExistVehicleNo = createAsyncThunk(
  "externalBookEntry/OnChangeExistVehicleNo",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangeExistVehicleNo(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeVisitor = createAsyncThunk(
  "externalBookEntry/OnChangeVisitor",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangeVisitor(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangePartyType = createAsyncThunk(
  "externalBookEntry/OnChangePartyType",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangePartyType(
        data
      );
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const create = createAsyncThunk(
  "externalBookEntry/create",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.create(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const update = createAsyncThunk(
  "externalBookEntry/update",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.update(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateImage = createAsyncThunk(
  "externalBookEntry/updateImage",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.updateImage(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const changestatus = createAsyncThunk(
  "externalBookEntry/changestatus",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.changestatus(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangePlant = createAsyncThunk(
  "externalBookEntry/OnChangePlant",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangePlant(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeDepartment = createAsyncThunk(
  "externalBookEntry/OnChangeDepartment",
  async (data: any, thunkAPI) => {
    try {
      const states = await ExternalBookVisitorEntryService.OnChangeDepartment(data);
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
const externalBookEntrySlice = createSlice({
  name: "externalBookEntry",
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
      .addCase(OnEnterMobileNo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnEnterMobileNo.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(OnEnterMobileNo.rejected, (state, action) => {
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
        state.TermsConditions = action.payload.TermsConditions;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangePlant.fulfilled, (state, action: any) => {
        state.loading = false;
        state.OnchangePlantList = action.payload.OnchangePlantList;
      })
      .addCase(OnChangePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangeDepartment.fulfilled, (state, action: any) => {
        state.loading = false;
        state.DtoEmployeeList = action.payload.EmployeeList;
      })
      .addCase(OnChangeDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeVehicleNo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OnChangeVehicleNo.fulfilled, (state, action: any) => {
        state.loading = false;
        state.DtoVisitorEntryHeader = action.payload.VisitorEntryHeader;
      })
      .addCase(OnChangeVehicleNo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { createOrEdit } = externalBookEntrySlice.actions;
export default externalBookEntrySlice.reducer;
