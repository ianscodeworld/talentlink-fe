// src/features/interviews/interviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMyAssignmentsApi } from '../../api/interviewApi';
import { submitFeedbackApi } from '../../api/candidateApi';

// Helper function for consistent error handling
const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

// Thunk for fetching paginated interview assignments
export const fetchMyAssignments = createAsyncThunk(
    'interviews/fetchMyAssignments',
    async (params, { rejectWithValue }) => {
        try {
            return await fetchMyAssignmentsApi(params);
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Thunk for submitting feedback
export const submitFeedback = createAsyncThunk(
    'interviews/submitFeedback',
    async ({ assignmentId, candidateId, feedbackData }, { rejectWithValue }) => {
        try {
            await submitFeedbackApi(candidateId, feedbackData);
            // On success, we don't need to return anything specific to this thunk,
            // as we will trigger a refetch of the list.
            return;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const interviewSlice = createSlice({
    name: 'interviews',
    initialState: {
        assignments: [],
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
            // Cases for fetching assignments
            .addCase(fetchMyAssignments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyAssignments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.assignments = action.payload.content;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.totalElements = action.payload.totalElements;
                state.pagination.currentPage = action.payload.number;
                state.pagination.size = action.payload.size;
            })
            .addCase(fetchMyAssignments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Case for submitting feedback
            .addCase(submitFeedback.fulfilled, (state, action) => {
                // After feedback is submitted successfully, we want to reload the list
                // to see the updated assignments. Setting status to 'idle' will
                // trigger the useEffect in MyAssignmentsPage to refetch the data.
                state.status = 'idle';
            });
    },
});

export default interviewSlice.reducer;