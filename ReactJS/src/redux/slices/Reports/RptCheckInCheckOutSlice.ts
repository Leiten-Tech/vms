import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as RptCheckInCheckOutService from "../../../services/RptCheckInCheckOutService";

export const CreateInitialize = createAsyncThunk(
  "rptcheckincheckout/CreateInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const rptcheckincheckout =
        await RptCheckInCheckOutService.CreateInitialize(data);

      return rptcheckincheckout.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// export const OnChangeVisitor = createAsyncThunk(
//   "rptcheckincheckout/OnChangeVisitor",
//   async (data: any, { rejectWithValue }) => {
//     try {
//       const rptcheckincheckout = await RptCheckInCheckOutService.OnChangeVisitor(data);

//       return rptcheckincheckout.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const SearchInitialize = createAsyncThunk(
  "rptcheckincheckout/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const rptcheckincheckout =
        await RptCheckInCheckOutService.SearchInitialize(data);

      return rptcheckincheckout.data;
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
  VisitorList: [],
  VisitorTypeList: [],
  PlantList: [],
  CheckinCheckoutList: [],
  HdrTable: [],
  PovList: [],
};

const RptcheckincheckoutSlice = createSlice({
  name: "rptcheckincheckout",
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
        state.VisitorTypeList = action.payload.VisitorTypeList;
        state.PlantList = action.payload.PlantList;
        state.HdrTable = action.payload.HdrTable;
        state.PovList = action.payload.PovList;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(OnChangeVisitor.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(OnChangeVisitor.fulfilled, (state, action: any) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.VisitorList = action.payload.VisitorList;
      //   state.CompanyList = action.payload.CompanyList;
      //   state.PlantList = action.payload.PlantList;
      //   state.HdrTable = action.payload.HdrTable;
      // })
      // .addCase(OnChangeVisitor.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      .addCase(SearchInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchInitialize.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.CheckinCheckoutList = action.payload.CheckinCheckoutList;
      })
      .addCase(SearchInitialize.rejected, (state, action: any) => {
        state.loading = false;
      });
  },
});

export const { createOrEdit } = RptcheckincheckoutSlice.actions;

export default RptcheckincheckoutSlice.reducer;
