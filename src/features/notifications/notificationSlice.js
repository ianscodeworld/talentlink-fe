// src/features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationsApi, markNotificationAsReadApi } from '../../api/notificationApi';

const handleApiError = (error) => { console.error('API Error:', error.response?.data); return error.response?.data?.details || error.response?.data?.message || 'An unexpected error occurred'; };

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (params, { rejectWithValue }) => {
    try { return await fetchNotificationsApi(params); } 
    catch (error) { return rejectWithValue(handleApiError(error)); }
});

export const markNotificationAsRead = createAsyncThunk('notifications/markNotificationAsRead', async (notificationId, { rejectWithValue }) => {
    try {
        await markNotificationAsReadApi(notificationId);
        return notificationId; // Return ID to update the state
    } catch (error) {
        return rejectWithValue(handleApiError(error));
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.notifications.content;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(fetchNotifications.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload;
                const notification = state.items.find(item => item.id === notificationId);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    },
});

export default notificationSlice.reducer;