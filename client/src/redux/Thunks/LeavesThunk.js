import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { LeaveEndPoints, OrganizationEndPoints } from "../apis/APIsEndpoints";

export const HandleGetLeaves = createAsyncThunk('HandleGetLeaves', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(LeaveEndPoints.GETALL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleCreateLeave = createAsyncThunk('HandleCreateLeave', async (leaveData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(LeaveEndPoints.CREATE, leaveData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleUpdateLeaveStatus = createAsyncThunk('HandleUpdateLeaveStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(LeaveEndPoints.UPDATEBYHR(id), { status }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleDeleteLeave = createAsyncThunk('HandleDeleteLeave', async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(LeaveEndPoints.DELETE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleGetOrgDetails = createAsyncThunk('HandleGetOrgDetails', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(OrganizationEndPoints.GETDETAILS, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleUpdateOrgDefaults = createAsyncThunk('HandleUpdateOrgDefaults', async (defaults, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(OrganizationEndPoints.UPDATEDEFAULTS, defaults, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
