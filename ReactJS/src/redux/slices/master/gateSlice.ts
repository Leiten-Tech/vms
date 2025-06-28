import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as GateService from "../../../services/GateService";
export const fetch = createAsyncThunk(
    "Gate/fetch",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.fetch(data);
            return Gates.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const createInit = createAsyncThunk(
    "Gate/createInit",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.createInit(data);
            return Gates.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const create = createAsyncThunk(
    "Gate/create",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.create(data);
            return Gates.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const update = createAsyncThunk(
    "Gate/update",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.update(data);
            return Gates.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const changeStatus = createAsyncThunk(
    "Gate/changeStatus",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.changeStatus(data);
            return Gates.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const OnChangeCompany = createAsyncThunk(
    "Gate/OnChangeCompany",
    async (data: any, thunkAPI) => {
        try {
            const Gates = await GateService.OnChangeCompany(data);
            return Gates.data;
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
    GateMasterList: [],
    HdrTable: null,
    GateList: [],
    StatusList: [],
    RoleList: [],
    gateDetailList: null
};

const gateSlice = createSlice({
    name: "gate",
    initialState,
    reducers: {
        createOrEdit: (state: any, action) => {
            
            state.createEditData = action.payload.data;
            state.HdrTable = null;
            state.GateDetailList = null;
            state.isCreate = action.payload.data != null ? false : true;
            state.OnChangeCompanyList = action.payload.OnChangeCompanyList;
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
                state.GateList = action.payload.GateList;
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
                state.StatusList = action.payload.StatusList;
                state.HdrTable = action.payload.HdrTable;
                state.EmployeeList = action.payload.EmployeeList;
                state.CompanyList = action.payload.CompanyList;
                state.PlantList = action.payload.PlantList;
                state.OnChangeCompanyList = action.payload.OnChangeCompanyList;
                state.GateDetailList = action.payload.GateDetailList;
                state.SecurityList = action.payload.SecurityList;
            })
            .addCase(createInit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OnChangeCompany.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(OnChangeCompany.fulfilled, (state, action: any) => {
                state.loading = false;
                state.OnChangeCompanyList = action.payload.OnChangeCompanyList;
            })
            .addCase(OnChangeCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(create.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.isLoading = false;
                state.createTranstatus = action.payload.transtatus;
                state.error = "";
            })
            .addCase(create.rejected, (state, action: any) => {
                state.isLoading = false;
            })
            .addCase(update.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(update.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stateUpdateList = action.payload.transtatus;
                state.error = "";
            })
            .addCase(update.rejected, (state, action: any) => {
                state.isLoading = false;
                // state.error=action.payload.error
            })
            .addCase(changeStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.stateDeletedList = action.payload.transtatus;
            })
            .addCase(changeStatus.rejected, (state, action: any) => {
                state.isLoading = false;
                // state.error=action.payload.error
            });
    },
})

export const { createOrEdit } = gateSlice.actions;

export default gateSlice.reducer;