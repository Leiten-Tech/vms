import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as PlantService from "../../../services/PlantService";

export const CreateInitialize = createAsyncThunk(
  "plant/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.CreateInitialize(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeCountry = createAsyncThunk(
  "plant/OnChangeCountry",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.OnChangeCountry(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeState = createAsyncThunk(
  "plant/OnChangeState",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.OnChangeState(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const SearchInitialize = createAsyncThunk(
  "plant/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.SearchInitialize(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Create = createAsyncThunk(
  "plant/Create",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.Create(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const Update = createAsyncThunk(
  "plant/Update",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.Update(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChangeStatus = createAsyncThunk(
  "plant/ChangeStatus",
  async (data: any, { rejectWithValue }) => {
    try {
      const plant = await PlantService.ChangeStatus(data);

      return plant.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeDepartment = createAsyncThunk(
  "Plant/OnChangeDepartment",
  async (data: any, thunkAPI) => {
    try {
      const Approvals = await PlantService.OnChangeDepartment(data);
      return Approvals.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
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
  PlantTypeList: [],
  CompanyList: [],
  CountryList: [],
  StateList: [],
  LevelList:[],
  DepartmentList:[],
  CityList: [],
  OnChangeCountry: [],
  OnChangeState: [],
  PlantList: [],
  PlantMasterList: [],
  plantUpdateRes:null,
  plantchangedstatusList: [],
  HdrTable: [],
};

const plantSlice = createSlice({
  name: "plant",
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
        state.PlantTypeList = action.payload.PlantTypeList;
        state.CompanyList = action.payload.CompanyList;
        state.PlantMasterList = action.payload.PlantMasterList;
        state.CountryList = action.payload.CountryList;
        state.HdrTable = action.payload.HdrTable;
        state.DetailList = action.payload.DetailList;
        state.PrimaryUserList = action.payload.PrimaryUserList;
        state.StateList = action.payload.StateList;
        state.CityList = action.payload.CityList;
        state.LevelList = action.payload.LevelList;
        state.DepartmentList = action.payload.DepartmentList;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeCountry.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
        state.StateList = action.payload.StateList;
      })
      .addCase(OnChangeCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeState.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeState.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;
        state.CityList = action.payload.CityList;
        state.error = "";
      })
      .addCase(OnChangeState.rejected, (state, action: any) => {
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
        state.PlantList = action.payload.PlantList;
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
        state.plantUpdateRes = action.payload.transtatus;
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
        state.plantchangedstatusList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
      });
  },
});

export const { createOrEdit } = plantSlice.actions;

export default plantSlice.reducer;
