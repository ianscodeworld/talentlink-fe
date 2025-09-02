// src/features/candidates/emailSummarySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateVendorEmailApi } from '../../api/candidateApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

export const generateVendorEmail = createAsyncThunk(
    'emailSummary/generateVendorEmail',
    async (candidateId, { rejectWithValue }) => {
        try {
            return await generateVendorEmailApi(candidateId);
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const emailSummarySlice = createSlice({
    name: 'emailSummary',
    initialState: {
        content: '',
        status: 'idle',
        error: null,
    },
    reducers: {
        clearEmailSummary: (state) => {
            state.content = '';
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateVendorEmail.pending, (state) => {
                state.status = 'loading';
                state.content = ''; // Clear previous content
            })
            .addCase(generateVendorEmail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.content = action.payload.emailContent;
            })
            .addCase(generateVendorEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearEmailSummary } = emailSummarySlice.actions;
export default emailSummarySlice.reducer;