import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CityService from "../../../services/CityService";

export const fetch = createAsyncThunk(
    "City/fetch",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.fetch(data);
            return Cities.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const createInit = createAsyncThunk(
    "City/createInit",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.createInit(data);
            return Cities.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const create = createAsyncThunk(
    "City/create",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.create(data);
            return Cities.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const update = createAsyncThunk(
    "City/update",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.update(data);
            return Cities.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const changeStatus = createAsyncThunk(
    "City/changeStatus",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.changeStatus(data);
            return Cities.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const OnChangeCountry = createAsyncThunk(
    "City/OnChangeCountry",
    async (data: any, thunkAPI) => {
        try {
            const Cities = await CityService.OnChangeCountry(data);
            return Cities.data;
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
    HdrTable: null,
    CountryList: [],
    StatusList: [],
    StateList: [],
    CityList: [],
    OnChangeCountryList: []
};
const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        createOrEdit: (state: any, action) => {
            
            state.createEditData = action.payload.data;
            state.HdrTable = null;
            state.isCreate = action.payload.data != null ? false : true;
            // state.OnChangeCountryList = action.payload.OnChangeCountryList;
            state.isView = action.payload.isView;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action: any) => {
                state.loading = false;
                state.error = "";
                state.CityList = action.payload.CityList;
            })
            .addCase(fetch.rejected, (state, action) => {
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
                state.StatusList = action.payload.StatusList;
                state.StateList = action.payload.StateList;
                state.CityList = action.payload.CityList;
            })
            .addCase(createInit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OnChangeCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(OnChangeCountry.fulfilled, (state, action: any) => {
                state.loading = false;
                state.StateList = action.payload.StateList;
            })
            .addCase(OnChangeCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(create.pending, (state) => {
                state.loading = true;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.loading = false;
                state.createTranstatus = action.payload.transtatus;
                state.error = "";
            })
            .addCase(create.rejected, (state, action: any) => {
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
})

export const { createOrEdit } = citySlice.actions;

export default citySlice.reducer;
