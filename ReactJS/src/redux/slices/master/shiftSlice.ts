import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ShiftService from "../../../services/ShiftService"

export const SearchInitialize = createAsyncThunk(
  "shift/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const shift = await ShiftService.SearchInitialize(data);

      return shift.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const CreateInitialize = createAsyncThunk(
  "shift/CreateInitialize",
  async (data: any, thunkAPI) => {
    try {
      const shift = await ShiftService.CreateInitialize(data);
      return shift.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Create = createAsyncThunk(
  "shift/Create",
  async (data: any, thunkAPI) => {
    try {
      const shift = await ShiftService.Create(data);
      return shift.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Update = createAsyncThunk(
  "shift/Update",
  async (data: any, thunkAPI) => {
    try {
      const shift = await ShiftService.Update(data);
      return shift.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const ChangeStatus = createAsyncThunk(
  "shift/ChangeStatus",
  async (data: any, thunkAPI) => {
    try {
      const shift = await ShiftService.ChangeStatus(data);
      return shift.data;
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
  HdrTable:[],
  CountryList:[],
  StatusList:[],
  stateList:null,
  cityList:[],
  ShiftList:null,
  updatetranstatus:[],
  createTranstatus:[]
};

const ShiftSlice = createSlice({
  name: "shift",
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
        state.ShiftList = action.payload.ShiftList;
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
        state.HdrTable = action.payload.HdrTable;
        state.CountryList = action.payload.CountryList;
        state.stateList = action.payload.StateList;
        state.cityList = action.payload.CityList;
        state.StatusList = action.payload.StatusList;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
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
        state.updatetranstatus = action.payload.transtatus;
        state.reload = true
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
        state.reload = true
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
        });
  },
});

export const { createOrEdit } = ShiftSlice.actions;

export default ShiftSlice.reducer;
