import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/api-service";
import { SalaryEndPoints } from "../apis/APIsEndpoints";

export const HandleGetSalaries = createAsyncThunk('HandleGetSalaries', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(SalaryEndPoints.GETALL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleCreateSalary = createAsyncThunk('HandleCreateSalary', async (salaryData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(SalaryEndPoints.CREATE, salaryData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleUpdateSalary = createAsyncThunk('HandleUpdateSalary', async (salaryData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(SalaryEndPoints.UPDATE, salaryData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleDeleteSalary = createAsyncThunk('HandleDeleteSalary', async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(SalaryEndPoints.DELETE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
