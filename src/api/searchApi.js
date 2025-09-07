// src/api/searchApi.js
import axiosInstance from './axiosInstance';

/**
 * 全局搜索候选人
 * @param {object} params - { q, page, size, sort }
 */
export const searchCandidatesApi = async (params) => {
    const response = await axiosInstance.get('/search/candidates', { params });
    return response.data;
};