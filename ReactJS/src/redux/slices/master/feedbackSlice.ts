import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FeedbackService from "../../../services/FeedbackService";

export const fetch = createAsyncThunk(
    "feedback/fetch",
    async (data: any, thunkAPI) => {
        try {
            const Feedbacks = await FeedbackService.fetch(data);
            return Feedbacks.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const CreateInit = createAsyncThunk(
    "feedback/CreateInit",
    async (data: any, thunkAPI) => {
        try {
            const Feedbacks = await FeedbackService.createInit(data);
            return Feedbacks.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const Create = createAsyncThunk(
    "feedback/Create",
    async (data: any, thunkAPI) => {
        try {
            const Feedbacks = await FeedbackService.create(data);
            return Feedbacks.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const update = createAsyncThunk(
    "feedback/Update",
    async (data: any, thunkAPI) => {
        try {
            const Feedbacks = await FeedbackService.update(data);
            return Feedbacks.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const changeStatus = createAsyncThunk(
    "feedback/changeStatus",
    async (data: any, thunkAPI) => {
        try {
            const Feedbacks = await FeedbackService.changeStatus(data);
            return Feedbacks.data;
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


const feedback = createSlice({
    name: "feedback",
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
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action: any) => {
                state.loading = false;
                state.error = "";
                state.FeedbackList = action.payload.FeedbackList;
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
                state.FeedbackHdr = action.payload.FeedbackHdr;
                state.FeedbackDetail = action.payload.FeedbackDetail;
                state.FeedbackGroups = action.payload.FeedbackGroups;
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
export const { createOrEdit } = feedback.actions;
export default feedback.reducer;