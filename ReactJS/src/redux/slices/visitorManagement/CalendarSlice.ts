import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import * as CalService from "../../../services/CalendarService";

export const fetch = createAsyncThunk(
  "Calendar/fetch",
  async (data: any, thunkAPI) => {
    try {
      const Calender = await CalService.fetch(data);
      return Calender.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
const initialState = {
    loading: false,
    error: null,
    AppointmentList: [],
    };
  const calenderSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetch.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetch.fulfilled, (state, action: any) => {
          state.loading = false;
          state.AppointmentList = action.payload.AppointmentList;
        })
        .addCase(fetch.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
});



export default calenderSlice.reducer;