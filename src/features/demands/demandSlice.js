// src/features/demands/demandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDemandsApi, createDemandApi, fetchDemandByIdApi, addCandidateApi, updateDemandStatusApi, updateDemandApi as updateDemandApi_demand, deleteDemandApi } from '../../api/demandApi';
import { updateCandidateStatusApi as updateCandidateStatusApi_candidate, submitFeedbackApi, checkDuplicateApi, updateCandidateRoundsApi, updateCandidateApi } from '../../api/candidateApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };
const updateCandidateInList = (state, updatedCandidate) => { if (state.selectedDemand) { const index = state.selectedDemand.candidates.findIndex(c => c.id === updatedCandidate.id); if (index !== -1) { state.selectedDemand.candidates[index] = updatedCandidate; } } };

export const fetchDemands = createAsyncThunk('demands/fetchDemands', async (params, { rejectWithValue }) => { try { return await fetchDemandsApi(params); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const createDemand = createAsyncThunk('demands/createDemand', async (demandData, { rejectWithValue }) => { try { return await createDemandApi(demandData); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const fetchDemandById = createAsyncThunk('demands/fetchDemandById', async (demandId, { rejectWithValue }) => { try { return await fetchDemandByIdApi(demandId); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const addCandidate = createAsyncThunk('demands/addCandidate', async ({ demandId, candidateData }, { rejectWithValue }) => { try { return await addCandidateApi(demandId, candidateData); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const checkDuplicateCandidate = createAsyncThunk('demands/checkDuplicateCandidate', async ({ name, demandId }, { rejectWithValue }) => { try { return await checkDuplicateApi({ name, demandId }); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateCandidateStatus = createAsyncThunk('demands/updateCandidateStatus', async ({ candidateId, status }, { rejectWithValue }) => { try { return await updateCandidateStatusApi_candidate(candidateId, status); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateDemandStatus = createAsyncThunk('demands/updateDemandStatus', async ({ demandId, status }, { rejectWithValue }) => { try { return await updateDemandStatusApi(demandId, status); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const submitFeedback = createAsyncThunk('demands/submitFeedback', async ({ candidateId, feedbackData }, { rejectWithValue }) => { try { await submitFeedbackApi(candidateId, feedbackData); return; } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateCandidateRounds = createAsyncThunk('demands/updateCandidateRounds', async ({ candidateId, totalRounds }, { rejectWithValue }) => { try { return await updateCandidateRoundsApi(candidateId, totalRounds); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateDemand = createAsyncThunk('demands/updateDemand', async ({ demandId, demandData }, { rejectWithValue }) => { try { return await updateDemandApi_demand(demandId, demandData); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const deleteDemand = createAsyncThunk('demands/deleteDemand', async (demandId, { rejectWithValue }) => { try { return await deleteDemandApi(demandId); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateCandidate = createAsyncThunk('demands/updateCandidate', async ({ candidateId, candidateData }, { rejectWithValue }) => { try { return await updateCandidateApi(candidateId, candidateData); } catch (error) { return rejectWithValue(handleApiError(error)); } });

const demandSlice = createSlice({
    name: 'demands',
    initialState: { items: [], status: 'idle', error: null, pagination: { totalPages: 0, totalElements: 0, currentPage: 0, size: 10 }, selectedDemand: null, detailStatus: 'idle', detailError: null },
    reducers: { clearSelectedDemand: (state) => { state.selectedDemand = null; state.detailStatus = 'idle'; state.detailError = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDemands.pending, (state) => { state.status = 'loading'; }).addCase(fetchDemands.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.content; state.pagination = { totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, currentPage: action.payload.number, size: action.payload.size }; }).addCase(fetchDemands.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(fetchDemandById.pending, (state) => { state.detailStatus = 'loading'; }).addCase(fetchDemandById.fulfilled, (state, action) => { state.detailStatus = 'succeeded'; state.selectedDemand = action.payload; }).addCase(fetchDemandById.rejected, (state, action) => { state.detailStatus = 'failed'; state.detailError = action.payload; })
            .addCase(addCandidate.fulfilled, (state, action) => { state.detailStatus = 'idle'; })
            .addCase(updateCandidateStatus.fulfilled, (state, action) => { updateCandidateInList(state, action.payload); })
            .addCase(updateDemandStatus.fulfilled, (state, action) => { state.status = 'idle'; if (state.selectedDemand && state.selectedDemand.id === action.payload.id) { state.selectedDemand = action.payload; } })
            .addCase(submitFeedback.fulfilled, (state, action) => { state.detailStatus = 'idle'; })
            .addCase(updateCandidateRounds.fulfilled, (state, action) => { updateCandidateInList(state, action.payload); })
            .addCase(createDemand.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(updateDemand.fulfilled, (state) => { state.status = 'idle'; state.detailStatus = 'idle'; })
            .addCase(deleteDemand.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(updateCandidate.fulfilled, (state, action) => { updateCandidateInList(state, action.payload); });
    },
});
export const { clearSelectedDemand } = demandSlice.actions;
export default demandSlice.reducer;