import { createSlice } from "@reduxjs/toolkit";
import {
    HandleGetLeaves,
    HandleCreateLeave,
    HandleUpdateLeaveStatus,
    HandleDeleteLeave,
    HandleGetOrgDetails,
    HandleUpdateOrgDefaults
} from "../Thunks/LeavesThunk";

const leavesSlice = createSlice({
    name: "leaves",
    initialState: {
        allLeaves: [],
        orgDetails: null,
        isLoading: false,
        isActionLoading: false,
        error: null,
        success: null
    },
    reducers: {
        ClearLeavesMessages: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Leaves
            .addCase(HandleGetLeaves.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(HandleGetLeaves.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allLeaves = action.payload.data || [];
            })
            .addCase(HandleGetLeaves.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Leave
            .addCase(HandleCreateLeave.pending, (state) => {
                state.isActionLoading = true;
                state.error = null;
            })
            .addCase(HandleCreateLeave.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
            })
            .addCase(HandleCreateLeave.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })

            // Update Status
            .addCase(HandleUpdateLeaveStatus.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(HandleUpdateLeaveStatus.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
            })
            .addCase(HandleUpdateLeaveStatus.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })

            // Get Org Details
            .addCase(HandleGetOrgDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleGetOrgDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orgDetails = action.payload.data;
            })
            .addCase(HandleGetOrgDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { ClearLeavesMessages } = leavesSlice.actions;
export default leavesSlice.reducer;
