import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as DashBoardService from "../../../services/DashBoardService";

export const fetch = createAsyncThunk(
    "DashBoard/SearchInitialize",
    async (data: any, { rejectWithValue }) => {
        try {
            const dashBoard = await DashBoardService.fetch(data);
            return dashBoard.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const dashOnClick = createAsyncThunk(
    "DashBoard/DashboardOnclick",
    async (data: any, { rejectWithValue }) => {
        try {
            const dashBoard = await DashBoardService.dashOnClick(data);
            return dashBoard.data;
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
    DashBoardList: [],
    ViewList: []
};
const DashBoardSlice = createSlice({
    name: "dashBoard",
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
            .addCase(fetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.VisitorList = action.payload.VisitorList;
                state.VisitorCountList = action.payload.VisitorCountList;
                state.ContractorCountList = action.payload.ContractorCountList;
                state.PurposeOfVisitList = action.payload.PurposeOfVisitList;
            })
            .addCase(fetch.rejected, (state, action: any) => {
                state.loading = false;
            })
            .addCase(dashOnClick.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dashOnClick.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.ViewList = action.payload.ViewList;
            })
            .addCase(dashOnClick.rejected, (state, action: any) => {
                state.loading = false;
            })
    },
});

export const { createOrEdit } = DashBoardSlice.actions;

export default DashBoardSlice.reducer;