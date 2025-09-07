// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchCandidatesApi } from '../../api/searchApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };

export const searchCandidates = createAsyncThunk('search/searchCandidates', async (params, { rejectWithValue }) => {
    try {
        return await searchCandidatesApi(params);
    } catch (error) {
        return rejectWithValue(handleApiError(error));
    }
});

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        results: [],
        query: '',
        status: 'idle',
        error: null,
        pagination: { totalPages: 0, totalElements: 0, currentPage: 0, size: 10 },
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchCandidates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchCandidates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload.content;
                state.pagination = { totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, currentPage: action.payload.number, size: action.payload.size };
            })
            .addCase(searchCandidates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setQuery } = searchSlice.actions;
export default searchSlice.reducer;