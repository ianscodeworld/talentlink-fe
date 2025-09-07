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
 * HM 创建一个新的用户账户
 * @param {object} userData - { name, email, role, specialties }
 */
export const createUserApi = async (userData) => {
    const response = await axiosInstance.post('/admin/users', userData);
    return response.data;
};

/**
 * HM 修改一个已存在用户的信息
 * @param {string} userId
 * @param {object} userData - { role, specialties }
 */
export const updateUserApi = async (userId, userData) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
};

/**
 * HM 删除一个用户
 * @param {string} userId
 */
export const deleteUserApi = async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
};