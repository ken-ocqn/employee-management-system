import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/api-service";
import { AttendanceEndPoints } from "../apis/APIsEndpoints";

export const HandleGetAttendances = createAsyncThunk("HandleGetAttendances", async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(AttendanceEndPoints.GETALL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleGetAttendanceById = createAsyncThunk("HandleGetAttendanceById", async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.get(AttendanceEndPoints.GETONE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateAttendance = createAsyncThunk("HandleUpdateAttendance", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.post(AttendanceEndPoints.UPDATE, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteAttendance = createAsyncThunk("HandleDeleteAttendance", async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(AttendanceEndPoints.DELETE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleInitializeAttendance = createAsyncThunk("HandleInitializeAttendance", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.post(AttendanceEndPoints.INITIALIZE, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleAttendanceLogin = createAsyncThunk("HandleAttendanceLogin", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.post(AttendanceEndPoints.LOGIN, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleAttendanceLogout = createAsyncThunk("HandleAttendanceLogout", async (data, { rejectWithValue }) => {
    try {
        const response = await apiService.post(AttendanceEndPoints.LOGOUT, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
