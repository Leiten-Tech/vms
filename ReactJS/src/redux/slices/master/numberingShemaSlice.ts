import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as numberingSchemaService from "../../../services/numberingSchemaService"

export const fetchNumberingSchema = createAsyncThunk(
  "numberingschema/fetchNumberingSchema",
  async (data: any, { rejectWithValue }) => {
    try {
      const numberingschema = await numberingSchemaService.fetchNumberingSchema(data);

      return numberingschema.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "numberingschema/createInit",
  async (data: any, thunkAPI) => {
    try {
      const numberingschema = await numberingSchemaService.createInit(data);
      return numberingschema.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const createNumberingSchema = createAsyncThunk(
  "numberingschema/createNumberingSchema",
  async (data: any, thunkAPI) => {
    try {
      const numberingschema = await numberingSchemaService.createNumberingSchema(data);
      return numberingschema.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateNumberingSchema = createAsyncThunk(
  "numberingschema/updateNumberingSchema",
  async (data: any, thunkAPI) => {
    try {
      const numberingschema = await numberingSchemaService.updateNumberingSchema(data);
      return numberingschema.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteNumberingSchema = createAsyncThunk(
  "numberingschema/deleteNumberingSchema",
  async (data: any, thunkAPI) => {
    try {
      const numberingschema = await numberingSchemaService.deleteNumberingSchema(data);
      return numberingschema.data;
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
  NumberingSchemaViewList: [],
  Country:null,
  DocumentList:[],
  SymbolList:[],
  DateFormatList:[],
  StatusList:[],
  NumberingSchema:[],
  numberingSchemaDeletedList:[],
  numberingSchemaUpdateList:[],
  reload:false
};

const numberingSchemaSlice = createSlice({
  name: "numberingSchema",
  initialState,
  reducers: {
    createOrEdit: (state: any, action) => {
      if(action.payload!=null){
      
      state.createEditData = action.payload.data;
      state.NumberingSchema = null;
      state.isCreate = action.payload.data != null ? false : true;
      state.isView = action.payload.isView;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNumberingSchema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumberingSchema.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = "";
        state.NumberingSchemaViewList = action.payload.NumberingSchemaViewList;
      })
      .addCase(fetchNumberingSchema.rejected, (state, action) => {
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
        state.DocumentList = action.payload.DocumentList;
        state.SymbolList = action.payload.SymbolList;
        state.DateFormatList = action.payload.DateFormatList;
        state.StatusList = action.payload.StatusList;
        state.NumberingSchema = action.payload.NumberingSchema;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNumberingSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNumberingSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;
        state.error = "";
      })
      .addCase(createNumberingSchema.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(updateNumberingSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNumberingSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.numberingSchemaUpdateList = action.payload.transtatus;
        state.reload = true;
        state.error = "";
      })
      .addCase(updateNumberingSchema.rejected, (state, action: any) => {
        state.loading = false;
       })
      .addCase(deleteNumberingSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNumberingSchema.fulfilled, (state, action) => {
        state.loading = false;
        state.reload = true;
        state.error = "";
        state.numberingSchemaDeletedList = action.payload.transtatus;
      })
      .addCase(deleteNumberingSchema.rejected, (state, action: any) => {
        state.loading = false;
        });
  },
});

export const { createOrEdit } = numberingSchemaSlice.actions;

export default numberingSchemaSlice.reducer;
