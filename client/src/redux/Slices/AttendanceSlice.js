import { createSlice } from "@reduxjs/toolkit";
import { HandleGetAttendances, HandleUpdateAttendance, HandleDeleteAttendance, HandleInitializeAttendance, HandleGetAttendanceById, HandleAttendanceLogin, HandleAttendanceLogout } from "../Thunks/AttendanceThunk";

const AttendanceSlice = createSlice({
    name: "AttendanceSlice",
    initialState: {
        isLoading: false,
        isActionLoading: false,
        allAttendance: [],
        currentAttendance: null,
        error: null,
    },
    reducers: {
        clearAttendanceError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get All
        builder.addCase(HandleGetAttendances.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(HandleGetAttendances.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allAttendance = action.payload.data;
        });
        builder.addCase(HandleGetAttendances.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Get One
        builder.addCase(HandleGetAttendanceById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(HandleGetAttendanceById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentAttendance = action.payload.data;
        });
        builder.addCase(HandleGetAttendanceById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update
        builder.addCase(HandleUpdateAttendance.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleUpdateAttendance.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.allAttendance = state.allAttendance.map(att => att._id === action.payload.data._id ? action.payload.data : att);
        });
        builder.addCase(HandleUpdateAttendance.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(HandleDeleteAttendance.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleDeleteAttendance.fulfilled, (state, action) => {
            state.isActionLoading = false;
            // The API might not return the ID of deleted record in action.payload.data, 
            // usually we need to handle this based on what the API returns.
            // Assuming successful delete means we should refetch or filter out.
        });
        builder.addCase(HandleDeleteAttendance.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Initialize
        builder.addCase(HandleInitializeAttendance.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleInitializeAttendance.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.allAttendance.push(action.payload.data);
        });
        builder.addCase(HandleInitializeAttendance.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Login
        builder.addCase(HandleAttendanceLogin.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleAttendanceLogin.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.currentAttendance = action.payload.data;
        });
        builder.addCase(HandleAttendanceLogin.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(HandleAttendanceLogout.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleAttendanceLogout.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.currentAttendance = action.payload.data;
        });
        builder.addCase(HandleAttendanceLogout.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearAttendanceError } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;
