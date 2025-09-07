// src/features/squads/squadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSquadsApi, createSquadApi, fetchSquadByIdApi, updateSquadStatusApi, deleteSquadApi } from '../../api/squadApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };

export const fetchSquads = createAsyncThunk('squads/fetchSquads', async (params, { rejectWithValue }) => { try { return await fetchSquadsApi(params); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const createSquad = createAsyncThunk('squads/createSquad', async (squadData, { rejectWithValue }) => { try { return await createSquadApi(squadData); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const fetchSquadById = createAsyncThunk('squads/fetchSquadById', async (squadId, { rejectWithValue }) => { try { return await fetchSquadByIdApi(squadId); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const updateSquadStatus = createAsyncThunk('squads/updateSquadStatus', async ({ squadId, status }, { rejectWithValue }) => { try { return await updateSquadStatusApi(squadId, status); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const deleteSquad = createAsyncThunk('squads/deleteSquad', async (squadId, { rejectWithValue }) => { try { await deleteSquadApi(squadId); return squadId; } catch (error) { return rejectWithValue(handleApiError(error)); } });

const squadSlice = createSlice({
    name: 'squads',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        pagination: { totalPages: 0, totalElements: 0, currentPage: 0, size: 10 },
        selectedSquad: null,
        detailStatus: 'idle',
        detailError: null,
    },
    reducers: {
        clearSelectedSquad: (state) => { state.selectedSquad = null; state.detailStatus = 'idle'; state.detailError = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSquads.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSquads.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.content; state.pagination = { totalPages: action.payload.totalPages, totalElements: action.payload.totalElements, currentPage: action.payload.number, size: action.payload.size }; })
            .addCase(fetchSquads.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(fetchSquadById.pending, (state) => { state.detailStatus = 'loading'; })
            .addCase(fetchSquadById.fulfilled, (state, action) => { state.detailStatus = 'succeeded'; state.selectedSquad = action.payload; })
            .addCase(fetchSquadById.rejected, (state, action) => { state.detailStatus = 'failed'; state.detailError = action.payload; })
            
            // --- THIS IS THE CHANGE ---
            // On any successful mutation, invalidate the list by setting status to 'idle'.
            // This will trigger the useEffect in the component to refetch the data.
            .addCase(createSquad.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(deleteSquad.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(updateSquadStatus.fulfilled, (state, action) => {
                // Also update the detail view if it's open, but most importantly, invalidate the list.
                state.status = 'idle';
                if (state.selectedSquad && state.selectedSquad.id === action.payload.id) {
                    state.selectedSquad = action.payload;
                }
            });
            // --- END CHANGE ---
    },
});

export const { clearSelectedSquad } = squadSlice.actions;
export default squadSlice.reducer;