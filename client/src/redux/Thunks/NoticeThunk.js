import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { NoticeEndPoints } from "../apis/APIsEndpoints";

export const HandleGetNotices = createAsyncThunk('HandleGetNotices', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(NoticeEndPoints.GETALL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleCreateNotice = createAsyncThunk('HandleCreateNotice', async (noticeData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(NoticeEndPoints.CREATE, noticeData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleUpdateNotice = createAsyncThunk('HandleUpdateNotice', async (noticeData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(NoticeEndPoints.UPDATE, noticeData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleDeleteNotice = createAsyncThunk('HandleDeleteNotice', async (id, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(NoticeEndPoints.DELETE(id), {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
