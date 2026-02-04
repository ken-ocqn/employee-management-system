import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/api-service";
import { RequestEndPoints } from "../apis/APIsEndpoints";

export const HandleGetRequests = createAsyncThunk("HandleGetRequests", async ({ apiroute } = {}, { rejectWithValue }) => {
    try {
        const endpoint = apiroute === "GET_MY_REQUESTS"
            ? RequestEndPoints.GET_MY_REQUESTS
            : RequestEndPoints.GETALL;

        const response = await apiService.get(endpoint, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleCreateRequest = createAsyncThunk("HandleCreateRequest", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.post(RequestEndPoints.CREATE, data, {
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
        const response = await apiService.post(RequestEndPoints.UPDATE_STATUS, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateAttachment = createAsyncThunk("HandleUpdateAttachment", async ({ requestID, file }, { rejectWithValue }) => {
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await apiService.post(RequestEndPoints.UPDATE_ATTACHMENT(requestID), formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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
