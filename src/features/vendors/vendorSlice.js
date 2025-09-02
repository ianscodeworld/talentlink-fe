// src/features/vendors/vendorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchVendorsApi } from '../../api/vendorApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

export const fetchVendors = createAsyncThunk(
    'vendors/fetchVendors',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchVendorsApi();
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const vendorSlice = createSlice({
    name: 'vendors',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default vendorSlice.reducer;