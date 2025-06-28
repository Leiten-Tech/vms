import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as employeeService from "../../../services/employeeService";

export const fetchEmployee = createAsyncThunk(
  "state/fetchEmployee",
  async (data: any, { rejectWithValue }) => {
    try {
      const states = await employeeService.fetchEmployee(data);

      return states.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "state/createInit",
  async (data: any, thunkAPI) => {
    try {
      const states = await employeeService.createInit(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createEmployee = createAsyncThunk(
  "state/createEmployee",
  async (data: any, thunkAPI) => {
    try {
      const states = await employeeService.createEmployee(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateEmployee = createAsyncThunk(
  "state/updateEmployee",
  async (data: any, thunkAPI) => {
    try {
      const states = await employeeService.updateEmployee(data);
      return states.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteEmployee = createAsyncThunk(
  "state/deleteEmployee",
  async (data: any, thunkAPI) => {
    try {
      const states = await employeeService.deleteEmployee(data);
      return states.data;
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
  CountryStatus: [],
  Country: null,
  DocumentList: [],
  SymbolList: [],
  DateFormatList: [],
  EmployeeList: [],
  BloodGroupList: [],
  DepartmentList: [],
  EmployeeTypeList: [],
  GenderList: [],
  MaritalStatusList: [],
  RoleList: [],
  StatusList: [],
  ReportingPerson: [],
  HdrTable: null,
  ReportingPersonList: [],
  EmployeeDocumentDetailList: null
};

const EmployeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      if (action.payload != null) {
        
        state.createEditData = action.payload.data;
        state.HdrTable = null;
        state.isCreate = action.payload.data != null ? false : true;
        state.isView = action.payload.isView;
        state.EmployeeDocumentDetailList = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: any) => {
        state.loading = false;
        state.EmployeeList = action.payload.EmployeeList;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
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
        state.BloodGroupList = action.payload.BloodGroupList;
        state.DepartmentList = action.payload.DepartmentList;
        state.EmployeeTypeList = action.payload.EmployeeTypeList;
        state.GenderList = action.payload.GenderList;
        state.MaritalStatusList = action.payload.MaritalStatusList;
        state.RoleList = action.payload.RoleList;
        state.StatusList = action.payload.StatusList;
        state.ReportingPerson = action.payload.EmployeeList;
        state.HdrTable = action.payload.HdrTable;
        state.ReportingPersonList = action.payload.ReportingPersonList;
        state.EmployeeDocumentDetailList = action.payload.EmployeeDocumentDetailList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(createEmployee.rejected, (state, action: any) => {
        state.isLoading = false;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateUpdateList = action.payload.transtatus;
        state.reload = true;
        state.error = "";
      })
      .addCase(updateEmployee.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reload = true;
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(deleteEmployee.rejected, (state, action: any) => {
        state.isLoading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = EmployeeSlice.actions;

export default EmployeeSlice.reducer;
