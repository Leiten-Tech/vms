import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as MaterialService from "../../../services/MaterialService";

export const fetchMaterial = createAsyncThunk(
  "material/fetchMaterial",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await MaterialService.fetchMaterial(data);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createInit = createAsyncThunk(
  "material/createInit",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.createInit(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeMaterialType = createAsyncThunk(
  "material/OnChangeMaterialType",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.OnChangeMaterialType(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeMaterialCatagory = createAsyncThunk(
  "material/OnChangeMaterialCatagory",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.OnChangeMaterialCatagory(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeMaterialSubCatagory = createAsyncThunk(
  "material/OnChangeMaterialSubCatagory",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.OnChangeMaterialSubCatagory(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const OnChangeBrand = createAsyncThunk(
  "material/OnChangeBrand",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.OnChangeBrand(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createMaterial = createAsyncThunk(
  "material/createMaterial",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.createMaterial(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const updateMaterial = createAsyncThunk(
  "material/updateMaterial",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.updateMaterial(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const deleteMaterial = createAsyncThunk(
  "material/deleteMaterial",
  async (data: any, thunkAPI) => {
    try {
      const res = await MaterialService.deleteMaterial(data);
      return res.data;
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
  MaterialList: [],
  Country: null,
  HdrTable: null,
  MaterialCategoryList: [],
  MaterialSubCategoryList: [],
  MaterialTypeList: [],
  materialUpdateRes:null,
  OnChangeBrand: [],
  StatusList: [],
  UomList: [],
  NumberingSchema: null,
  reload: false,
};

const materialSlice = createSlice({
  name: "material",
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
      .addCase(fetchMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterial.fulfilled, (state, action: any) => {
        state.loading = false;
        state.MaterialList = action.payload.MaterialList;
      })
      .addCase(fetchMaterial.rejected, (state, action) => {
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
        state.MaterialCategoryList = action.payload.MaterialCategoryList;
        state.MaterialSubCategoryList = action.payload.MaterialSubCategoryList;
        state.MaterialTypeList = action.payload.MaterialTypeList;
        state.StatusList = action.payload.StatusList;
        state.UomList = action.payload.UomList;
      })
      .addCase(createInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeMaterialType.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeMaterialType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.MaterialTypeList = action.payload.MaterialTypeOnChange;
      })
      .addCase(OnChangeMaterialType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeMaterialCatagory.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeMaterialCatagory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.MaterialCategoryList = action.payload.MaterialCategoryOnChange;
      })
      .addCase(OnChangeMaterialCatagory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeMaterialSubCatagory.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeMaterialSubCatagory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.MaterialSubCategoryList =
          action.payload.MaterialSubCategoryOnChange;
      })
      .addCase(OnChangeMaterialSubCatagory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(OnChangeBrand.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OnChangeBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.OnChangeBrand = action.payload.BrandOnChange;
      })
      .addCase(OnChangeBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.createTranstatus = action.payload.transtatus;

        state.error = "";
      })
      .addCase(createMaterial.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(updateMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materialUpdateRes = action.payload.transtatus;
        state.error = "";
      })
      .addCase(updateMaterial.rejected, (state, action: any) => {
        state.loading = false;
       })
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.reload = true;
        state.error = "";
        state.stateDeletedList = action.payload.transtatus;
      })
      .addCase(deleteMaterial.rejected, (state, action: any) => {
        state.loading = false;
        // state.error=action.payload.error
      });
  },
});

export const { createOrEdit } = materialSlice.actions;

export default materialSlice.reducer;
