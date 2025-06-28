import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthService from "../../../services/AuthService";

export const login = createAsyncThunk(
  "/auth/login",
  async (data: any, { rejectWithValue }) => {
    try {
      const user = await AuthService.login(data);
      

      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/logout",
  async (data: any, { rejectWithValue }) => {
    try {
      const sessionId = {
        SessionId: localStorage["data_SessionID"].replaceAll(/["\\]/g, ""),
      };
      const user = await AuthService.logout(sessionId);
      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const checkAuthTrial = createAsyncThunk(
  "/auth/checkAuthTrial",
  async (data: any, { rejectWithValue }) => {
    try {
      const user = await AuthService.checkAuthTrial(data);
      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getHeaderGateList = createAsyncThunk(
  "/auth/getHeaderGateList",
  async (data: any, { rejectWithValue }) => {
    try {
      const user = await AuthService.getHeadGate(data);
      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  gateList: [],
  error: "",
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        let userLoggedData = action.payload;
        

        for (const key in userLoggedData) {
          if (userLoggedData.hasOwnProperty(key)) {
            const objectToStore = userLoggedData[key];
            const storageKey = `data_${key}`;
            if (typeof objectToStore == "object") {
              localStorage.setItem(storageKey, JSON.stringify(objectToStore));
            } else {
              localStorage.setItem(storageKey, objectToStore);
            }
          }
        }
        for (const key in userLoggedData["UserHeader"]) {
          if (userLoggedData.hasOwnProperty("UserHeader")) {
            const objectToStore = userLoggedData["UserHeader"][key];
            if (typeof objectToStore == "object") {
              localStorage.setItem(key, JSON.stringify(objectToStore));
            } else {
              localStorage.setItem(key, objectToStore);
            }
          }
        }

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(logout.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        // localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        localStorage.clear();
        localStorage.clear();
        state.user = action.payload;
      })
      .addCase(logout.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getHeaderGateList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getHeaderGateList.fulfilled, (state, action) => {
        state.loading = false; 
        state.gateList = action.payload.gateList;
      })
      .addCase(getHeaderGateList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(checkAuthTrial.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(checkAuthTrial.fulfilled, (state, action) => {
        state.loading = false; 
      })
      .addCase(checkAuthTrial.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// export const { createOrEdit } = authSlice.actions;

export default authSlice.reducer;
