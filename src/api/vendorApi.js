// src/api/vendorApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取所有供应商列表
 */
export const fetchVendorsApi = async () => {
    const response = await axiosInstance.get('/vendors');
    return response.data; // 响应体应为 Vendor[] 数组
};