// src/api/talentPoolApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取人才库候选人列表 (ON_HOLD状态)
 * @param {object} params - { specialty, name, page, size, sort }
 */
export const fetchTalentPoolApi = async (params) => {
    const response = await axiosInstance.get('/talent-pool', { params });
    return response.data;
};

/**
 * 从人才库中重新激活一个候选人
 * @param {object} data - { candidateId, targetDemandId }
 */
export const reactivateCandidateApi = async (data) => {
    const response = await axiosInstance.post('/talent-pool/reactivate', data);
    return response.data;
};