// src/api/dashboardApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取 HM Dashboard 所需的聚合统计数据
 */
export const fetchHmSummaryApi = async () => {
    const response = await axiosInstance.get('/dashboard/hm-summary');
    return response.data;
};