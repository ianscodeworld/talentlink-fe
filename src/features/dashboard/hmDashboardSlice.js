// src/features/dashboard/hmDashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHmSummaryApi } from '../../api/dashboardApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

export const fetchHmSummary = createAsyncThunk(
    'hmDashboard/fetchHmSummary',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchHmSummaryApi();
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const hmDashboardSlice = createSlice({
    name: 'hmDashboard',
    initialState: {
        summary: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHmSummary.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHmSummary.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.summary = action.payload;
            })
            .addCase(fetchHmSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default hmDashboardSlice.reducer;