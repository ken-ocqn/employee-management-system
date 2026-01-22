import { createSlice } from "@reduxjs/toolkit";
import {
    HandleGetSalaries,
    HandleCreateSalary,
    HandleUpdateSalary,
    HandleDeleteSalary
} from "../Thunks/SalaryThunk";

const salarySlice = createSlice({
    name: "salaries",
    initialState: {
        allSalaries: [],
        isLoading: false,
        isActionLoading: false,
        error: null,
        success: null,
        fetchData: true
    },
    reducers: {
        ClearSalaryMessages: (state) => {
            state.error = null;
            state.success = null;
        },
        SetFetchSalaryData: (state, action) => {
            state.fetchData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Salaries
            .addCase(HandleGetSalaries.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(HandleGetSalaries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allSalaries = action.payload.data || [];
                state.fetchData = false;
            })
            .addCase(HandleGetSalaries.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Salary
            .addCase(HandleCreateSalary.pending, (state) => {
                state.isActionLoading = true;
                state.error = null;
            })
            .addCase(HandleCreateSalary.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
                state.fetchData = true;
            })
            .addCase(HandleCreateSalary.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })

            // Update Salary
            .addCase(HandleUpdateSalary.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(HandleUpdateSalary.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
                state.fetchData = true;
            })
            .addCase(HandleUpdateSalary.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })

            // Delete Salary
            .addCase(HandleDeleteSalary.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(HandleDeleteSalary.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.success = action.payload.message;
                state.fetchData = true;
            })
            .addCase(HandleDeleteSalary.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            });
    }
});

export const { ClearSalaryMessages, SetFetchSalaryData } = salarySlice.actions;
export default salarySlice.reducer;
