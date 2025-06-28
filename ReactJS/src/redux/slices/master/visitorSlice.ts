import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as VisitorService from "../../../services/VisitorService";


export const fetch = createAsyncThunk(
    "visitor/fetch",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.fetch(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const createInitVM = createAsyncThunk(
    "visitor/createInit",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.createInit(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const OnChangeCountryVM = createAsyncThunk(
    "visitor/OnChangeCountry",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.OnChangeCountry(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const OnChangeStateVM = createAsyncThunk(
    "visitor/OnChangeState",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.OnChangeState(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const createVM = createAsyncThunk(
    "visitor/create",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.create(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const updateVM = createAsyncThunk(
    "visitor/update",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.update(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const changestatus = createAsyncThunk(
    "visitor/changestatus",
    async (data: any, thunkAPI) => {
        try {
            const states = await VisitorService.changestatus(data);
            return states.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
const Initialize = {
    isCreateVM: true,
    isViewVM: false,
    createEditDataVM: null,
    loadingVM: false,
    errorVM: null,
    tranStatusVM: null,
    VisitorHeaderVM: null,
    VisitorTypeListVM: [],
    TitleListVM: [],
    IdCardListVM: [],
    StatusListVM: [],
    CountryListVM: [],
    StateListVM: [],
    CityListVM: [],
    DepartmentListVM: [],
    VisitorDetailVM: [],
    VisitorSearchListVM: [],
    WorkSeverityListVM:[],
    VisitorTypeSearchListVM:[]
};
const visitorSlice = createSlice({
    name: "visitor",
    initialState: Initialize,
    reducers: {
        createOrEdit: (state: any, action) => {
            if (action.payload != null) {
                state.createEditData = action.payload.data;
                state.VisitorHeader = null;
                state.VisitorDetail = null;
                state.isCreate = action.payload.data != null ? false : true;
                state.isView = action.payload.isView;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateVM.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVM.fulfilled, (state, action: any) => {
                state.loading = false;
                state.tranStatus = action.payload.tranStatus;
            })
            .addCase(updateVM.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createVM.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVM.fulfilled, (state, action: any) => {
                state.loading = false;
                state.tranStatus = action.payload.tranStatus;
            })
            .addCase(createVM.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action: any) => {
                state.loading = false;
                state.VisitorTypeSearchListVM = action.payload.VisitorTypeSearchList;
                state.VisitorSearchListVM = action.payload.VisitorSearchList;
            })
            .addCase(fetch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createInitVM.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInitVM.fulfilled, (state, action: any) => {
                state.loading = false;
                state.VisitorTypeListVM = action.payload.VisitorTypeList;
                state.TitleListVM = action.payload.TitleList;
                state.IdCardListVM = action.payload.IdCardList;
                state.StatusListVM = action.payload.StatusList;
                state.WorkSeverityListVM = action.payload.WorkSeverityList;
                state.CountryListVM = action.payload.CountryList;
                state.DepartmentListVM = action.payload.DepartmentList;
                state.StateListVM = action.payload.StateList;
                state.CityListVM = action.payload.CityList;
                state.VisitorHeaderVM = action.payload.VisitorHeader;
                state.VisitorDetailVM = action.payload.VisitorDetail;
            })
            .addCase(createInitVM.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OnChangeCountryVM.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(OnChangeCountryVM.fulfilled, (state, action: any) => {
                state.loading = false;
                state.StateListVM = action.payload.StateList;
                state.CityListVM = [];
            })
            .addCase(OnChangeCountryVM.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OnChangeStateVM.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(OnChangeStateVM.fulfilled, (state, action: any) => {
                state.loading = false;
                state.CityListVM = action.payload.CityList;
            })
            .addCase(OnChangeStateVM.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { createOrEdit } = visitorSlice.actions;

export default visitorSlice.reducer;