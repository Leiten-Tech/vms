import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CompanyService from "../../../services/CompanyService";

export const SearchInitialize = createAsyncThunk(
  "company/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const companies = await CompanyService.SearchInitialize(data);

      return companies.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeCountry = createAsyncThunk(
  "company/OnChangeCountry",
  async (data: any, { rejectWithValue }) => {
    try {
      const companies = await CompanyService.OnChangeCountry(data);

      return companies.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeState = createAsyncThunk(
  "company/OnChangeState",
  async (data: any, { rejectWithValue }) => {
    try {
      const companies = await CompanyService.OnChangeState(data);

      return companies.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const CreateInitialize = createAsyncThunk(
  "company/CreateInitialize",
  async (data: any, thunkAPI) => {
    try {
      const companies = await CompanyService.CreateInitialize(data);
      return companies.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Create = createAsyncThunk(
  "company/Create",
  async (data: any, thunkAPI) => {
    try {
      const companies = await CompanyService.Create(data);
      return companies.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Update = createAsyncThunk(
  "company/Update",
  async (data: any, thunkAPI) => {
    try {
      const companies = await CompanyService.Update(data);
      return companies.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const ChangeStatus = createAsyncThunk(
  "company/ChangeStatus",
  async (data: any, thunkAPI) => {
    try {
      const companies = await CompanyService.ChangeStatus(data);
      return companies.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: false,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  StatusList: [],
  CountryList:[],
  StateList:[],
  CityList:[],
  CompanyList: [],
  HdrTable: [],
};

const companySlice = createSlice({
  name: "companySlice",
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
        state.error = "";
        state.CompanyList = action.payload.CompanyList;
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
        state.CompanyList = action.payload.CompanyList;
        state.CountryList = action.payload.CountryList;
        state.StateList = action.payload.StateList;
        state.CityList = action.payload.CityList;
        state.HdrTable = action.payload.HdrTable;
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
      .addCase(Create.pending, (state) => {
        state.loading = true;
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
      })
      .addCase(Update.fulfilled, (state, action) => {
        state.loading = false;
        state.companyUpdateList = action.payload.transtatus;
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
        state.companyDeletedList = action.payload.transtatus;
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
        });
  },
});

export const { createOrEdit } = companySlice.actions;

export default companySlice.reducer;
