// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { loginApi } from '../../api/authApi';
import { updateMyPasswordApi } from '../../api/userApi';

const handleApiError = (error) => {
    console.error('API Error:', error.response?.data);
    return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred';
};

const getUserFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
                console.log('%cDECODED JWT PAYLOAD:', 'color: red; font-size: 14px; font-weight: bold;', decoded); 

        let userRole = null;
        if (decoded.role) {
            userRole = decoded.role;
        } else if (decoded.authorities && Array.isArray(decoded.authorities)) {
            if (decoded.authorities.includes('HM') || decoded.authorities.includes('ROLE_HM')) {
                userRole = 'HM';
            } else if (decoded.authorities.includes('INTERVIEWER') || decoded.authorities.includes('ROLE_INTERVIEWER')) {
                userRole = 'INTERVIEWER';
            }
        }
        return { ...decoded, role: userRole, passwordChangeRequired: decoded.passwordChangeRequired };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

const initialToken = localStorage.getItem('token');
const initialUser = getUserFromToken(initialToken);

// Thunk #1: For user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginApi(credentials);
            localStorage.setItem('token', data.token);
            return data.token;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Thunk #2: For updating the current user's password
export const updateMyPassword = createAsyncThunk(
    'auth/updateMyPassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            await updateMyPasswordApi(passwordData);
            return;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: initialToken,
        isAuthenticated: !!initialUser,
        user: initialUser,
        status: 'idle', 
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.user = getUserFromToken(action.payload);
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })
            // After password update is successful, we log the user out,
            // forcing them to re-authenticate with their new password.
            .addCase(updateMyPassword.fulfilled, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('token');
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;