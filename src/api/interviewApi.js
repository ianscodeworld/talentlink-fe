// src/api/interviewApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取当前登录面试官的所有未完成面试任务（支持分页）
 * @param {object} params - { page, size, sort }
 */
export const fetchMyAssignmentsApi = async (params) => {
    const response = await axiosInstance.get('/interviews/my-assignments', { params });
    return response.data;
};