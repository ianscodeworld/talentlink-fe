// src/api/demandApi.js
import axiosInstance from './axiosInstance';

export const fetchDemandsApi = async (params) => {
    const response = await axiosInstance.get('/demands', { params });
    return response.data;
};

export const createDemandApi = async (demandData) => {
    const response = await axiosInstance.post('/demands', demandData);
    return response.data;
};

export const fetchDemandByIdApi = async (demandId) => {
    const response = await axiosInstance.get(`/demands/${demandId}`);
    return response.data;
};

export const addCandidateApi = async (demandId, candidateData) => {
    const response = await axiosInstance.post(`/demands/${demandId}/candidates`, candidateData);
    return response.data;
};

export const updateDemandStatusApi = async (demandId, status) => {
    const response = await axiosInstance.put(`/demands/${demandId}/status`, { status });
    return response.data;
};

export const fetchRelevantDemandsApi = async (params) => {
    const response = await axiosInstance.get('/demands/relevant', { params });
    return response.data;
};

export const updateDemandApi = async (demandId, demandData) => {
    const response = await axiosInstance.put(`/demands/${demandId}`, demandData);
    return response.data;
};

export const deleteDemandApi = async (demandId) => {
    await axiosInstance.delete(`/demands/${demandId}`);
    return demandId;
};