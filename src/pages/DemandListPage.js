// src/pages/DemandListPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography, message, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchDemands, createDemand, updateDemand, deleteDemand, updateDemandStatus } from '../features/demands/demandSlice';
import { fetchSquads } from '../features/squads/squadSlice';
import CreateDemandModal from '../features/demands/CreateDemandModal';
import EditDemandModal from '../features/demands/EditDemandModal';

const { Title } = Typography;
const { Option } = Select;

const DemandListPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingDemand, setEditingDemand] = useState(null);
    const dispatch = useDispatch();

    const { items: demands, status, error, pagination } = useSelector((state) => state.demands);
    const { items: squads, status: squadsStatus } = useSelector((state) => state.squads);

    useEffect(() => {
        if (status === 'idle') { dispatch(fetchDemands({ page: 0, size: 10, sort: 'createdAt,desc' })); }
        if (squadsStatus === 'idle') { dispatch(fetchSquads({ page: 0, size: 100 })); }
    }, [status, squadsStatus, dispatch]);
    
    const handleCreate = async (values) => { try { await dispatch(createDemand(values)).unwrap(); message.success('Demand created successfully!'); setIsCreateModalOpen(false); } catch (err) { message.error(`Failed to create demand: ${err}`); } };
    const handleUpdate = async (demandId, values) => { try { await dispatch(updateDemand({ demandId, demandData: values })).unwrap(); message.success('Demand updated successfully!'); setEditingDemand(null); } catch (err) { message.error(`Failed to update demand: ${err}`); } };
    const handleDelete = async (demandId) => { try { await dispatch(deleteDemand(demandId)).unwrap(); message.success('Demand deleted successfully!'); } catch (err) { message.error(`Failed to delete demand: ${err}`); } };
    const handleTableChange = (tablePagination, filters, sorter) => { /* ... */ };
    const handleStatusChange = (demandId, newStatus) => { /* ... */ };

    const columns = [
        { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle', sorter: true },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status, record) => ( <Select value={status} style={{ width: 120 }} onChange={(value) => handleStatusChange(record.id, value)}> <Option value="OPEN">OPEN</Option> <Option value="HIRED">HIRED</Option> <Option value="CLOSED">CLOSED</Option> <Option value="ON_HOLD">ON_HOLD</Option> </Select> ) },
        { title: 'Action', key: 'action', render: (_, record) => (
            <Space size="small">
                <Button type="link" onClick={() => { setEditingDemand(record) }} icon={<EditOutlined />}>Edit</Button>
                <Link to={`/hm/demands/${record.id}`}>View Details</Link>
                <Popconfirm title="Delete this demand?" onConfirm={() => handleDelete(record.id)}><Button type="link" danger icon={<DeleteOutlined />}>Delete</Button></Popconfirm>
            </Space>
        )},
    ];

    return (
        <div>
            <Title level={2}>My Demands</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)} style={{ marginBottom: 16 }}>Create New Demand</Button>
            <CreateDemandModal open={isCreateModalOpen} onCreate={handleCreate} onCancel={() => setIsCreateModalOpen(false)} squads={squads} squadsLoading={squadsStatus === 'loading'} />
            <EditDemandModal open={!!editingDemand} onUpdate={handleUpdate} onCancel={() => setEditingDemand(null)} initialData={editingDemand} />
            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table columns={columns} dataSource={demands} rowKey="id" loading={status === 'loading'} onChange={handleTableChange} pagination={{ current: pagination.currentPage + 1, pageSize: pagination.size, total: pagination.totalElements }} />
        </div>
    );
};

export default DemandListPage;