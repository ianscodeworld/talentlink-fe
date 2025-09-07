// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../features/auth/authSlice';

// Import all reducers
import authReducer from '../features/auth/authSlice';
import demandReducer from '../features/demands/demandSlice';
import relevantDemandsReducer from '../features/demands/relevantDemandsSlice';
import vendorReducer from '../features/vendors/vendorSlice';
import userReducer from '../features/users/userSlice';
import interviewReducer from '../features/interviews/interviewSlice';
import candidateHistoryReducer from '../features/candidates/candidateHistorySlice';
import emailSummaryReducer from '../features/candidates/emailSummarySlice';
import squadReducer from '../features/squads/squadSlice';
import hmDashboardReducer from '../features/dashboard/hmDashboardSlice';
import talentPoolReducer from '../features/talentPool/talentPoolSlice';
import searchReducer from '../features/search/searchSlice';
import notificationReducer from '../features/notifications/notificationSlice';


// --- START: DEBUG LOG ---
console.log('[DEBUG] Importing talentPoolReducer. Is it defined?', talentPoolReducer);
// --- END: DEBUG LOG ---

const appReducer = combineReducers({
    auth: authReducer,
    demands: demandReducer,
    relevantDemands: relevantDemandsReducer,
    vendors: vendorReducer,
    users: userReducer,
    interviews: interviewReducer,
    candidateHistory: candidateHistoryReducer,
    emailSummary: emailSummaryReducer,
    squads: squadReducer,
    hmDashboard: hmDashboardReducer,
    talentPool: talentPoolReducer,
    search: searchReducer, // Add this line
    notifications: notificationReducer, // Add this line

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