// src/api/authApi.js
import axiosInstance from './axiosInstance';

export const loginApi = async (credentials) => {
    // --- CHECKPOINT 2 ---
    console.log('Checkpoint 2: Preparing to send API request via axios.');
    // --- END CHECKPOINT ---
    
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};