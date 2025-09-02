// src/api/userApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取用户列表（支持分页和角色过滤）
 * @param {object} params - { page, size, sort, role }
 */
export const fetchUsersApi = async (params) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
};

/**
 * 当前登录用户修改自己的密码
 * @param {object} passwordData - { newPassword: '...' }
 */
export const updateMyPasswordApi = async (passwordData) => {
    const response = await axiosInstance.put('/users/me/password', passwordData);
    return response.data;
};

/**
 * HM 创建一个新的面试官账户
 * @param {object} userData - { name, email, specialties }
 */
export const createUserApi = async (userData) => {
    const response = await axiosInstance.post('/admin/users', userData);
    // 假设后端会特别为此返回一个包含临时密码的对象
    return response.data;
};