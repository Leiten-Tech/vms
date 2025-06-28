import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CountryService from "../../../services/countryService";

export const fetchCountries = createAsyncThunk(
  "country/fetchCountries",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CountryService.fetchCountries(data);

      return countries.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "country/createInit",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CountryService.createInit(data);
      
      
      return countries.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createCountries = createAsyncThunk(
  "country/createCountries",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CountryService.createCountries(data);
      return countries.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateCountries = createAsyncThunk(
  "country/updateCountries",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CountryService.updateCountries(data);
      return countries.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteCountries = createAsyncThunk(
  "country/deleteCountries",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CountryService.deleteCountries(data);
      return countries.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: true,
  isView: false,
  createEditData: null,
  CountryUpdateRes: null,
  CountryCreateRes: null,
  CountryDelRes: null,
  loading: false,
  error: null,
  StatusList: [],
  CountryList: [],
  Country: null,
  HdrTable: [],
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      

      if (action.payload != null) {
        
        state.createEditData = action.payload.data;
        state.HdrTable = null
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CountryList = action.payload.CountryList;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
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
        state.Country = action.payload.Country;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.CountryCreateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(createCountries.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(updateCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.CountryUpdateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(updateCountries.rejected, (state, action: any) => {
        state.loading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.CountryDelRes = action.payload.transtatus;
      })
      .addCase(deleteCountries.rejected, (state, action: any) => {
        state.loading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = countrySlice.actions;

export default countrySlice.reducer;
