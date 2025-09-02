// src/pages/HMDashboardPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDemands, createDemand, updateDemandStatus } from '../features/demands/demandSlice';
import { Table, Button, Spin, Alert, Typography, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateDemandModal from '../features/demands/CreateDemandModal';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const HMDashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { items: demands, status, error, pagination } = useSelector((state) => state.demands);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDemands({ page: 0, size: 10, sort: 'createdAt,desc' }));
        }
    }, [status, dispatch]);
    
    const handleCreate = async (values) => {
        try {
            await dispatch(createDemand(values)).unwrap();
            message.success('Demand created successfully!');
            setIsModalOpen(false);
        } catch (err) {
            message.error(`Failed to create demand: ${err}`);
        }
    };
    
    const handleTableChange = (tablePagination, filters, sorter) => {
        const page = tablePagination.current - 1;
        const size = tablePagination.pageSize;
        const sort = sorter.field ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'createdAt,desc';
        dispatch(fetchDemands({ page, size, sort }));
    };

    const handleStatusChange = (demandId, newStatus) => {
        dispatch(updateDemandStatus({ demandId, status: newStatus }))
            .unwrap()
            .then(() => message.success('Demand status updated'))
            .catch((err) => message.error(`Failed to update status: ${err}`));
    };

    const columns = [
        { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle', sorter: true },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            render: (status, record) => (
                <Select 
                    value={status} // FIX: Changed from defaultValue to value
                    style={{ width: 120 }} 
                    onChange={(value) => handleStatusChange(record.id, value)}
                >
                    <Option value="OPEN">OPEN</Option>
                    <Option value="HIRED">HIRED</Option>
                    <Option value="CLOSED">CLOSED</Option>
                    <Option value="ON_HOLD">ON_HOLD</Option>
                </Select>
            )
        },
        { title: 'Rounds', dataIndex: 'totalInterviewRounds', key: 'totalInterviewRounds' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', sorter: true, defaultSortOrder: 'descend', render: (text) => new Date(text).toLocaleDateString() },
        { title: 'Action', key: 'action', render: (_, record) => (<Link to={`/hm/demands/${record.id}`}>View Details</Link>) },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2}>My Demands</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Create New Demand</Button>
            </div>
            <CreateDemandModal open={isModalOpen} onCreate={handleCreate} onCancel={() => setIsModalOpen(false)} />
            
            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}

            <Table
                columns={columns}
                dataSource={demands}
                rowKey="id"
                loading={status === 'loading'}
                onChange={handleTableChange}
                pagination={{
                    current: pagination.currentPage + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements,
                }}
            />
        </div>
    );
};

export default HMDashboardPage;