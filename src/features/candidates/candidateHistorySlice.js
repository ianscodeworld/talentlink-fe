// src/features/candidates/candidateHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCandidateHistoryApi } from '../../api/candidateApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

export const fetchCandidateHistory = createAsyncThunk(
    'candidateHistory/fetchCandidateHistory',
    async ({ candidateId, params }, { rejectWithValue }) => {
        try {
            return await fetchCandidateHistoryApi(candidateId, params);
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const candidateHistorySlice = createSlice({
    name: 'candidateHistory',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        pagination: {
            totalPages: 0,
            totalElements: 0,
            currentPage: 0,
            size: 20, // Default size
        },
    },
    reducers: {
        clearHistory: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
            state.pagination = { totalPages: 0, totalElements: 0, currentPage: 0, size: 20 };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCandidateHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.totalElements = action.payload.totalElements;
                state.pagination.currentPage = action.payload.number;
                state.pagination.size = action.payload.size;
            })
            .addCase(fetchCandidateHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearHistory } = candidateHistorySlice.actions;
export default candidateHistorySlice.reducer;