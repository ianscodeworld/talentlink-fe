// src/api/candidateApi.js
import axiosInstance from './axiosInstance';

export const updateCandidateApi = async (candidateId, candidateData) => {
    const response = await axiosInstance.put(`/candidates/${candidateId}`, candidateData);
    return response.data;
};

export const submitFeedbackApi = async (candidateId, feedbackData) => { const response = await axiosInstance.post(`/candidates/${candidateId}/feedback`, feedbackData); return response; };
export const updateCandidateStatusApi = async (candidateId, status) => { const response = await axiosInstance.put(`/candidates/${candidateId}/status`, { status }); return response.data; };
export const fetchCandidateHistoryApi = async (candidateId, params) => { const response = await axiosInstance.get(`/candidates/${candidateId}/history`, { params }); return response.data; };
export const generateVendorEmailApi = async (candidateId) => { const response = await axiosInstance.get(`/candidates/${candidateId}/vendor-email`); return response.data; };
export const checkDuplicateApi = async (nameData) => { const response = await axiosInstance.post(`/candidates/check-duplicate`, nameData); return response.data; };
export const updateCandidateRoundsApi = async (candidateId, totalRounds) => { const response = await axiosInstance.put(`/candidates/${candidateId}/rounds`, { totalRounds }); return response.data; };