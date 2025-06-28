import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as CategoryCPMapService from "../../../services/CategoryCPMapService";

export const fetch = createAsyncThunk(
    "catogory/fetch",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.fetch(data);
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const CreateInit = createAsyncThunk(
    "catogory/CreateInit",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.createInit(data);
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const Create = createAsyncThunk(
    "catogory/Create",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.create(data);
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const update = createAsyncThunk(
    "catogory/Update",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.update(data);
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const FilterCategory = createAsyncThunk(
    "catogorycpmap/FilterCategory",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.filterCategory(
                data
            );
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const changeStatus = createAsyncThunk(
    "catogorycpmap/changeStatus",
    async (data: any, thunkAPI) => {
        try {
            const Categories = await CategoryCPMapService.changeStatus(data);
            return Categories.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const Initialize = {
    isCreate: true,
    isView: false,
    createEditData: null,
    loading: false,
    error: null,
    tranStatus: null,
    CategoryList: [],
};

const categoryCPMap = createSlice({
    name: "categorycpmap",
    initialState: Initialize,
    reducers: {
        createOrEdit: (state: any, action) => {
            if (action.payload != null) {
                

                state.isCreate = action.payload.data != null ? false : true;
                state.createEditData = action.payload.data;
                state.isView = action.payload.isView;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action: any) => {
                state.loading = false;
                state.error = "";
                state.CategoryCPMapList = action.payload.CategoryCPMapList;
            })
            .addCase(fetch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(CreateInit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateInit.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.CategoryMapList = action.payload.CategoryMapList;
                state.CategoryMapDetailList = action.payload.CategoryMapDetailList;
                state.StatusList = action.payload.StatusList;
            })
            .addCase(CreateInit.rejected, (state, action) => {
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
            .addCase(update.pending, (state) => {
                state.loading = true;
            })
            .addCase(update.fulfilled, (state, action) => {
                state.loading = false;
                state.stateUpdateList = action.payload.transtatus;
                state.error = "";
            })
            .addCase(update.rejected, (state, action: any) => {
                state.loading = false;
                // state.error=action.payload.error
            })
            .addCase(FilterCategory.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(FilterCategory.fulfilled, (state, action: any) => {
                state.loading = false;
            })
            .addCase(FilterCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changeStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.stateDeletedList = action.payload.transtatus;
            })
            .addCase(changeStatus.rejected, (state, action: any) => {
                state.loading = false;
                // state.error=action.payload.error
            });
    },
});
export const { createOrEdit } = categoryCPMap.actions;
export default categoryCPMap.reducer;