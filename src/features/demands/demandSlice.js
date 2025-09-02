// src/features/demands/demandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    fetchDemandsApi, 
    createDemandApi, 
    fetchDemandByIdApi, 
    addCandidateApi, 
    updateDemandStatusApi 
} from '../../api/demandApi';
import { 
    updateCandidateStatusApi as updateCandidateStatusApi_candidate, // Use alias to avoid name conflict
    submitFeedbackApi
} from '../../api/candidateApi';

// --- Helper Functions (Defined Once) ---

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

const updateCandidateInList = (state, updatedCandidate) => {
    if (state.selectedDemand) {
        const index = state.selectedDemand.candidates.findIndex(c => c.id === updatedCandidate.id);
        if (index !== -1) {
            state.selectedDemand.candidates[index] = updatedCandidate;
        }
    }
};


// --- Async Thunks (Defined Once) ---

export const fetchDemands = createAsyncThunk(
    'demands/fetchDemands', 
    async (params, { rejectWithValue }) => { 
        try { return await fetchDemandsApi(params); } 
        catch (error) { return rejectWithValue(handleApiError(error)); } 
    }
);

export const createDemand = createAsyncThunk(
    'demands/createDemand', 
    async (demandData, { rejectWithValue }) => { 
        try { return await createDemandApi(demandData); } 
        catch (error) { return rejectWithValue(handleApiError(error)); } 
    }
);

export const fetchDemandById = createAsyncThunk(
    'demands/fetchDemandById', 
    async (demandId, { rejectWithValue }) => { 
        try { return await fetchDemandByIdApi(demandId); } 
        catch (error) { return rejectWithValue(handleApiError(error)); } 
    }
);

export const addCandidate = createAsyncThunk(
    'demands/addCandidate', 
    async ({ demandId, candidateData }, { rejectWithValue }) => { 
        try { return await addCandidateApi(demandId, candidateData); } 
        catch (error) { return rejectWithValue(handleApiError(error)); } 
    }
);

export const updateCandidateStatus = createAsyncThunk(
    'demands/updateCandidateStatus', 
    async ({ candidateId, status }, { rejectWithValue }) => { 
        try { return await updateCandidateStatusApi_candidate(candidateId, status); } 
        catch (error) { return rejectWithValue(handleApiError(error)); } 
    }
);

export const updateDemandStatus = createAsyncThunk(
    'demands/updateDemandStatus',
    async ({ demandId, status }, { rejectWithValue }) => {
        try { return await updateDemandStatusApi(demandId, status); } 
        catch (error) { return rejectWithValue(handleApiError(error)); }
    }
);

export const submitFeedback = createAsyncThunk(
    'demands/submitFeedback',
    async ({ candidateId, feedbackData }, { rejectWithValue }) => {
        try {
            await submitFeedbackApi(candidateId, feedbackData);
            return;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);


// --- Slice Definition ---

const demandSlice = createSlice({
    name: 'demands',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        pagination: { totalPages: 0, totalElements: 0, currentPage: 0, size: 10 },
        selectedDemand: null,
        detailStatus: 'idle',
        detailError: null,
    },
    reducers: {
        clearSelectedDemand: (state) => { 
            state.selectedDemand = null; 
            state.detailStatus = 'idle'; 
            state.detailError = null; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDemands.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDemands.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content; 
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.totalElements = action.payload.totalElements;
                state.pagination.currentPage = action.payload.number;
                state.pagination.size = action.payload.size;
            })
            .addCase(fetchDemands.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            
            .addCase(createDemand.fulfilled, (state, action) => { state.status = 'idle'; })
            
            .addCase(fetchDemandById.pending, (state) => { state.detailStatus = 'loading'; })
            .addCase(fetchDemandById.fulfilled, (state, action) => { state.detailStatus = 'succeeded'; state.selectedDemand = action.payload; })
            .addCase(fetchDemandById.rejected, (state, action) => { state.detailStatus = 'failed'; state.detailError = action.payload; })
            
            .addCase(addCandidate.fulfilled, (state, action) => { if (state.selectedDemand) { state.selectedDemand.candidates.unshift(action.payload); } })
            
            .addCase(updateCandidateStatus.fulfilled, (state, action) => { updateCandidateInList(state, action.payload); })
            
            .addCase(updateDemandStatus.fulfilled, (state, action) => {
                const updatedDemand = action.payload;
                const index = state.items.findIndex(d => d.id === updatedDemand.id);
                if (index !== -1) {
                    state.items[index] = updatedDemand;
                }
                if (state.selectedDemand && state.selectedDemand.id === updatedDemand.id) {
                    state.selectedDemand = updatedDemand;
                }
            })

            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.detailStatus = 'idle';
            });
    },
});

export const { clearSelectedDemand } = demandSlice.actions;
export default demandSlice.reducer;