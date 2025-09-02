// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../features/auth/authSlice';
import authReducer from '../features/auth/authSlice';
import demandReducer from '../features/demands/demandSlice';
import relevantDemandsReducer from '../features/demands/relevantDemandsSlice';
import vendorReducer from '../features/vendors/vendorSlice';
import userReducer from '../features/users/userSlice';
import interviewReducer from '../features/interviews/interviewSlice';
import candidateHistoryReducer from '../features/candidates/candidateHistorySlice';
import emailSummaryReducer from '../features/candidates/emailSummarySlice'; // 1. Import

const appReducer = combineReducers({
    auth: authReducer,
    demands: demandReducer,
    relevantDemands: relevantDemandsReducer,
    vendors: vendorReducer,
    users: userReducer,
    interviews: interviewReducer,
    candidateHistory: candidateHistoryReducer,
    emailSummary: emailSummaryReducer, // 2. Add
});

const rootReducer = (state, action) => {
    if (action.type === logout.type) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
});