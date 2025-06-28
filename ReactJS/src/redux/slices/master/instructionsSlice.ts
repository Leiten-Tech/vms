import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as InstructionsService from "../../../services/InstructionsService";

export const SearchInitialize = createAsyncThunk(
  "Instructions/SearchInitialize",
  async (data: any, { rejectWithValue }) => {
    try {
      const instructions = await InstructionsService.SearchInitialize(data);

      return instructions.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const OnChangeCompany = createAsyncThunk(
  "Instructions/OnChangeCountry",
  async (data: any, { rejectWithValue }) => {
    try {
      const instructions = await InstructionsService.OnChangeCompany(data);

      return instructions.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const CreateInitialize = createAsyncThunk(
  "Instructions/CreateInitialize",
  async (data: any, thunkAPI) => {
    try {
      const instructions = await InstructionsService.CreateInitialize(data);
      return instructions.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Create = createAsyncThunk(
  "Instructions/Create",
  async (data: any, thunkAPI) => {
    try {
      const instructions = await InstructionsService.Create(data);
      return instructions.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const Update = createAsyncThunk(
  "Instructions/Update",
  async (data: any, thunkAPI) => {
    try {
      const instructions = await InstructionsService.Update(data);
      return instructions.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const ChangeStatus = createAsyncThunk(
  "Instructions/ChangeStatus",
  async (data: any, thunkAPI) => {
    try {
      const instructions = await InstructionsService.ChangeStatus(data);
      return instructions.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isCreate: false,
  isView: false,
  createEditData: null,
  loading: false,
  error: null,
  StatusList: [],
  CountryList:[],
  InstructionsList:[],
  VisitorTypeList:[],
  createTranstatus:[],
  PlantList:[],
  CompanyList: [],
  HdrTable: [],
};

const instructionSlice = createSlice({
  name: "instructions",
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
      .addCase(SearchInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchInitialize.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = "";
        state.CompanyList = action.payload.CompanyList;
        state.InstructionsList = action.payload.InstructionsList;
        
      })
      .addCase(SearchInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(CreateInitialize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateInitialize.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.StatusList = action.payload.StatusList;
        state.CompanyList = action.payload.CompanyList;
        state.PlantList = action.payload.PlantList;
        state.VisitorTypeList= action.payload.VisitorTypeList;
        state.InstructionsList = action.payload.InstructionsList;
        state.HdrTable = action.payload.HdrTable;
      })
      .addCase(CreateInitialize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeCompany.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
        state.PlantList = action.payload.PlantList;
      })
      .addCase(OnChangeCompany.rejected, (state, action) => {
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
      .addCase(Update.pending, (state) => {
        state.loading = true;
      })
      .addCase(Update.fulfilled, (state, action) => {
        state.loading = false;
        //state.companyUpdateList = action.payload.transtatus;
        state.error = "";
      })
      .addCase(Update.rejected, (state, action: any) => {
        state.loading = false;
       
})
      .addCase(ChangeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        //state.companyDeletedList = action.payload.transtatus;
      })
      .addCase(ChangeStatus.rejected, (state, action: any) => {
        state.loading = false;
        });
  },
});

export const { createOrEdit } = instructionSlice.actions;

export default instructionSlice.reducer;
