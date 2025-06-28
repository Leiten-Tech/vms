import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as customerService from "../../../services/customerService"

export const fetchCustomer = createAsyncThunk(
  "state/fetchCustomer",
  async (data: any, { rejectWithValue }) => {
    try {
      const states = await customerService.fetchCustomer(data);

      return states.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeCountry = createAsyncThunk(
    "state/OnChangeCountry",
    async (data: any, thunkAPI) => {
      try {
        const states = await customerService.OnChangeCountry(data);
        return states.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
      }
    }
  );

  export const OnChangeState = createAsyncThunk(
    "state/OnChangeState",
    async (data: any, thunkAPI) => {
      try {
        const states = await customerService.OnChangeState(data);
        return states.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
      }
    }
  );

export const createInit = createAsyncThunk(
  "state/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await customerService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createCustomer = createAsyncThunk(
  "state/createCustomer",
  async (data: any, thunkAPI) => {
    try {
      const states = await customerService.createCustomer(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateCustomer = createAsyncThunk(
  "state/updateCustomer",
  async (data: any, thunkAPI) => {
    try {
      const states = await customerService.updateCustomer(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteCustomer = createAsyncThunk(
  "state/deleteCustomer",
  async (data: any, thunkAPI) => {
    try {
      const states = await customerService.deleteCustomer(data);
      return states.data;
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
  CountryStatus: [],
  Country:null,
  reload:false,

  //
  HdrTable:null,
  CountryList:[],
  StatusList:[],
  StateList: [],
  cityList:[],
  CustomerList:null,
  updatetranstatus:[],
  createTranstatus:[]
};

const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      if(action.payload!=null){
      
      state.createEditData = action.payload.data;
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
      state.HdrTable = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CustomerList = action.payload.CustomerList;
        

      })
      .addCase(fetchCustomer.rejected, (state, action) => {
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
        state.HdrTable = action.payload.HdrTable;
        state.CountryList = action.payload.CountryList;
        state.StateList = action.payload.StateList;
        state.cityList = action.payload.CityList;
        state.StatusList = action.payload.StatusList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createTranstatus = action.payload.transtatus;
        
        state.error = "";
      })
      .addCase(createCustomer.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(OnChangeCountry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnChangeCountry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.StateList = action.payload.OnChangeCountry;
        state.error = "";
      })
      .addCase(OnChangeCountry.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(OnChangeState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnChangeState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.CityList = action.payload.OnChangeState;
        state.error = "";
      })
      .addCase(OnChangeState.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatetranstatus = action.payload.transtatus;
        state.reload = true
        state.error = "";
      })
      .addCase(updateCustomer.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reload = true
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(deleteCustomer.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = CustomerSlice.actions;

export default CustomerSlice.reducer;
