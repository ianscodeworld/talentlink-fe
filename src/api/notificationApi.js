// src/api/notificationApi.js
import axiosInstance from './axiosInstance';

/**
 * 获取当前用户的通知列表
 * @param {object} params - { page, size, sort }
 */
export const fetchNotificationsApi = async (params) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
};

/**
 * 将单条通知标记为已读
 * @param {string} notificationId 
 */
export const markNotificationAsReadApi = async (notificationId) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
};