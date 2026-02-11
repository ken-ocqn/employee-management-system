import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/api-service";
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

export const HandleCreateNotice = createAsyncThunk('HandleCreateNotice', async (formData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(NoticeEndPoints.CREATE, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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

export const HandleGetNoticeAttachment = createAsyncThunk('HandleGetNoticeAttachment', async (noticeID, { rejectWithValue }) => {
    try {
        const response = await apiService.get(`/api/v1/notice/attachment/${noticeID}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const HandleGetEmployeeNotices = createAsyncThunk('HandleGetEmployeeNotices', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(NoticeEndPoints.GET_EMPLOYEE_NOTICES, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
