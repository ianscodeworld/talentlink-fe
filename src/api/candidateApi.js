// src/api/candidateApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取为候选人生成的格式化反馈邮件文本
 * @param {string} candidateId 
 */
export const generateVendorEmailApi = async (candidateId) => {
    const response = await axiosInstance.get(`/candidates/${candidateId}/vendor-email`);
    return response.data; // 响应体应为 { emailContent: "..." }
};

// --- Full existing code for completeness ---
export const assignInterviewerApi = async (candidateId, interviewerId) => { const response = await axiosInstance.put(`/candidates/${candidateId}/assign`, { interviewerId }); return response.data; };
export const submitFeedbackApi = async (candidateId, feedbackData) => { const response = await axiosInstance.post(`/candidates/${candidateId}/feedback`, feedbackData); return response; };
export const updateCandidateStatusApi = async (candidateId, status) => { const response = await axiosInstance.put(`/candidates/${candidateId}/status`, { status }); return response.data; };
export const fetchCandidateHistoryApi = async (candidateId, params) => { const response = await axiosInstance.get(`/candidates/${candidateId}/history`, { params }); return response.data; };