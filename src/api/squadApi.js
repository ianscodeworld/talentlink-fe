// src/api/squadApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取 Squad 列表（支持分页和状态筛选）
 * @param {object} params - { page, size, sort, status }
 */
export const fetchSquadsApi = async (params) => {
    const response = await axiosInstance.get('/squads', { params });
    return response.data;
};

/**
 * 创建一个新的 Squad
 * @param {object} squadData - { name: "..." }
 */
export const createSquadApi = async (squadData) => {
    const response = await axiosInstance.post('/squads', squadData);
    return response.data;
};

/**
 * 根据 ID 获取单个 Squad 详情
 * @param {string} squadId 
 */
export const fetchSquadByIdApi = async (squadId) => {
    const response = await axiosInstance.get(`/squads/${squadId}`);
    return response.data;
};

/**
 * 更新一个 Squad 的状态
 * @param {string} squadId 
 * @param {string} status 
 */
export const updateSquadStatusApi = async (squadId, status) => {
    const response = await axiosInstance.put(`/squads/${squadId}/status`, { status });
    return response.data;
};

/**
 * 软删除一个 Squad
 * @param {string} squadId 
 */
export const deleteSquadApi = async (squadId) => {
    const response = await axiosInstance.delete(`/squads/${squadId}`);
    return response.data;
};