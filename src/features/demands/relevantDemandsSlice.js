// src/features/demands/relevantDemandsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRelevantDemandsApi } from '../../api/demandApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

export const fetchRelevantDemands = createAsyncThunk(
    'relevantDemands/fetchRelevantDemands',
    async (params, { rejectWithValue }) => {
        try {
            return await fetchRelevantDemandsApi(params);
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const relevantDemandsSlice = createSlice({
    name: 'relevantDemands',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        pagination: {
            totalPages: 0,
            totalElements: 0,
            currentPage: 0,
            size: 10,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRelevantDemands.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRelevantDemands.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.totalElements = action.payload.totalElements;
                state.pagination.currentPage = action.payload.number;
                state.pagination.size = action.payload.size;
            })
            .addCase(fetchRelevantDemands.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default relevantDemandsSlice.reducer;