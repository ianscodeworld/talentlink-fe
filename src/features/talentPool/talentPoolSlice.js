// src/features/talentPool/talentPoolSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTalentPoolApi, reactivateCandidateApi } from '../../api/talentPoolApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };

export const fetchTalentPool = createAsyncThunk('talentPool/fetchTalentPool', async (params, { rejectWithValue }) => {
    try { return await fetchTalentPoolApi(params); } 
    catch (error) { return rejectWithValue(handleApiError(error)); }
});

export const reactivateCandidate = createAsyncThunk('talentPool/reactivateCandidate', async (data, { rejectWithValue }) => {
    try { return await reactivateCandidateApi(data); } 
    catch (error) { return rejectWithValue(handleApiError(error)); }
});

const talentPoolSlice = createSlice({
    name: 'talentPool',
    initialState: {
        candidates: [],
        status: 'idle',
        error: null,
        pagination: { totalPages: 0, totalElements: 0, currentPage: 0, size: 10 },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTalentPool.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTalentPool.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.candidates = action.payload.content;
                state.pagination = { totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, currentPage: action.payload.number, size: action.payload.size };
            })
            .addCase(fetchTalentPool.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(reactivateCandidate.fulfilled, (state, action) => {
                // Remove the reactivated candidate from the talent pool list
                state.candidates = state.candidates.filter(c => c.id !== action.payload.id);
            });
    },
});

export default talentPoolSlice.reducer;