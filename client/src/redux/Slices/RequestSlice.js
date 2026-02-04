import { createSlice } from "@reduxjs/toolkit";
import { HandleGetRequests, HandleUpdateRequestStatus, HandleDeleteRequest, HandleGetRequestById, HandleCreateRequest, HandleUpdateAttachment } from "../Thunks/RequestThunk";

const RequestSlice = createSlice({
    name: "RequestSlice",
    initialState: {
        isLoading: false,
        isActionLoading: false,
        allRequests: [],
        currentRequest: null,
        error: null,
    },
    reducers: {
        clearRequestError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get All
        builder.addCase(HandleGetRequests.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(HandleGetRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allRequests = action.payload.data;
        });
        builder.addCase(HandleGetRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Get One
        builder.addCase(HandleGetRequestById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(HandleGetRequestById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentRequest = action.payload.data;
        });
        builder.addCase(HandleGetRequestById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update Status
        builder.addCase(HandleUpdateRequestStatus.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleUpdateRequestStatus.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.allRequests = state.allRequests.map(req => req._id === action.payload.data._id ? action.payload.data : req);
        });
        builder.addCase(HandleUpdateRequestStatus.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Create Request
        builder.addCase(HandleCreateRequest.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleCreateRequest.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.allRequests.push(action.payload.data);
        });
        builder.addCase(HandleCreateRequest.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(HandleDeleteRequest.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleDeleteRequest.fulfilled, (state, action) => {
            state.isActionLoading = false;
            // Handle filtering locally after successful delete if needed, or refetch
        });
        builder.addCase(HandleDeleteRequest.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });

        // Update Attachment
        builder.addCase(HandleUpdateAttachment.pending, (state) => {
            state.isActionLoading = true;
        });
        builder.addCase(HandleUpdateAttachment.fulfilled, (state, action) => {
            state.isActionLoading = false;
            state.allRequests = state.allRequests.map(req => req._id === action.payload.data._id ? action.payload.data : req);
        });
        builder.addCase(HandleUpdateAttachment.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearRequestError } = RequestSlice.actions;
export default RequestSlice.reducer;
