import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/api-service";
import { RequestEndPoints } from "../apis/APIsEndpoints";

export const HandleGetRequests = createAsyncThunk("HandleGetRequests", async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(RequestEndPoints.GETALL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleGetRequestById = createAsyncThunk("HandleGetRequestById", async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.get(RequestEndPoints.GETONE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateRequestStatus = createAsyncThunk("HandleUpdateRequestStatus", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(RequestEndPoints.UPDATE_STATUS, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteRequest = createAsyncThunk("HandleDeleteRequest", async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(RequestEndPoints.DELETE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
