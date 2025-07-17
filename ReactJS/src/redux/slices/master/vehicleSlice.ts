import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as VehicleService from "../../../services/VehicleService";

export const fetch = createAsyncThunk(
    "Vehicle/fetch",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.fetch(data);
            return Vehicles.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const createInit = createAsyncThunk(
    "Vehicle/createInit",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.createInit(data);
            return Vehicles.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const create = createAsyncThunk(
    "Vehicle/create",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.create(data);
            return Vehicles.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const update = createAsyncThunk(
    "Vehicle/update",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.update(data);
            return Vehicles.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const changeStatus = createAsyncThunk(
    "Vehicle/changeStatus",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.changeStatus(data);
            return Vehicles.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
export const OnChangeCompany = createAsyncThunk(
    "Vehicle/OnChangeCompany",
    async (data: any, thunkAPI) => {
        try {
            const Vehicles = await VehicleService.OnChangeCompany(data);
            return Vehicles.data;
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
    RoleList: [],
    StatusList: [],
    VehicleTypeList: [],
    SupplierList: [],
    EmployeeList: [],
    CompanyList: [],
    PlantList: [],
    PurposeList: [],
    OnChangeCompanyList: [],
    VehicleList: [],
    VehicleDocumentDetailList:[],
    DriverList:[]
};
const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        createOrEdit: (state: any, action) => {
            
            state.createEditData = action.payload.data;
            state.HdrTable = null;
            //state.GateDetailList = null;
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
                state.VehicleList = action.payload.VehicleList;
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
                state.VehicleTypeList = action.payload.VehicleTypeList;
                state.SupplierList = action.payload.SupplierList;
                state.EmployeeList = action.payload.EmployeeList;
                state.CompanyList = action.payload.CompanyList;
                state.PlantList = action.payload.PlantList;
                state.HdrTable = action.payload.HdrTable;
                state.VehicleDetailList = action.payload.VehicleDocumentDetailList;
                state.DriverList = action.payload.DriverList;
             state.PurposeList = action.payload.PurposeList;

                // state.OnChangeCompanyList = action.payload.OnChangeCompanyList;
                //state.GateDetailList = action.payload.GateDetailList;
            })
            .addCase(createInit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OnChangeCompany.pending, (state) => {
                state.loading = true;
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

export const { createOrEdit } = vehicleSlice.actions;

export default vehicleSlice.reducer;
