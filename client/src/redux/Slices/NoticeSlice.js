import { createSlice } from "@reduxjs/toolkit";
import {
    HandleGetNotices,
    HandleCreateNotice,
    HandleDeleteNotice
} from "../Thunks/NoticeThunk";

const noticeSlice = createSlice({
    name: "notices",
    initialState: {
        allNotices: [],
        isLoading: false,
        isActionLoading: false,
        error: null,
        success: null,
        fetchData: true
    },
    reducers: {
        ClearNoticeMessages: (state) => {
            state.error = null;
            state.success = null;
        },
        SetFetchNoticeData: (state, action) => {
            state.fetchData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Notices
            .addCase(HandleGetNotices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(HandleGetNotices.fulfilled, (state, action) => {
                state.isLoading = false;
                const { department_notices, employee_notices } = action.payload.data || {};
                state.allNotices = [...(department_notices || []), ...(employee_notices || [])];
                state.fetchData = false;
            })
            .addCase(HandleGetNotices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Notice
            .addCase(HandleCreateNotice.pending, (state) => {
                state.isActionLoading = true;
                state.error = null;
            })
            .addCase(HandleCreateNotice.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
                state.fetchData = true;
            })
            .addCase(HandleCreateNotice.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })


            // Delete Notice
            .addCase(HandleDeleteNotice.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(HandleDeleteNotice.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
                state.fetchData = true;
            })
            .addCase(HandleDeleteNotice.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            });
    }
});

export const { ClearNoticeMessages, SetFetchNoticeData } = noticeSlice.actions;
export default noticeSlice.reducer;
