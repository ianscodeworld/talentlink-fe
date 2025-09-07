// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsersApi, createUserApi, deleteUserApi, updateUserApi } from '../../api/userApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };

export const fetchInterviewers = createAsyncThunk('users/fetchInterviewers', async (params, { rejectWithValue }) => { try { const finalParams = { role: 'INTERVIEWER', page: 0, size: 100, ...params }; return await fetchUsersApi(finalParams); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => { try { return await createUserApi(userData); } catch (error) { return rejectWithValue(handleApiError(error)); } });
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => { try { await deleteUserApi(userId); return userId; } catch (error) { return rejectWithValue(handleApiError(error)); } });

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            return await updateUserApi(userId, userData);
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        interviewers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterviewers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchInterviewers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.interviewers = action.payload.content;
            })
            .addCase(fetchInterviewers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            
            // 创建、更新或删除用户成功后，将状态设为 idle 以便列表页可以自动刷新
            .addCase(createUser.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.status = 'idle';
            });
    },
});

export default userSlice.reducer;