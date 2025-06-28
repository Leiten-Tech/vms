import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as PreviewPassService from "../../../services/PreviewPassService";

export const CreateInitialize = createAsyncThunk(
  "PreviewPass/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const PreviewPass = await PreviewPassService.CreateInitialize(data);
      return PreviewPass.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const initialState = {
    isCreate: true,
    createEditData: null,
    loading: false,
    error: null,
    createTranstatus: null,
    PlantList: [],
  };
  
  const PreviewPassSlice = createSlice({
    name: "PreviewPass",
    initialState,
    reducers: {
      createOrEdit: (state: any, action) => {
        state.createEditData = action.payload.data;
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
          state.PlantList = action.payload.PlantList;
        })
        .addCase(CreateInitialize.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
});