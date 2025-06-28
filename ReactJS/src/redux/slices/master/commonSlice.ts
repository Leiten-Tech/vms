import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CommonService from "../../../services/commonService";

export const sendCheckOutTimer = createAsyncThunk(
  "country/sendCheckOutTimer",
  async (data: any, thunkAPI) => {
    try {
      const countries = await CommonService.sendCheckOutTimer(data);

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
  loading: false,
  error: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      if (action.payload != null) {
        state.createEditData = action.payload.data;
        state.HdrTable = null;
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCheckOutTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendCheckOutTimer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.CountryList = action.payload.CountryList;
      })
      .addCase(sendCheckOutTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { createOrEdit } = commonSlice.actions;

export default commonSlice.reducer;
