// src/pages/admin/SquadManagementPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography, message, Select, Space, Dropdown, Popconfirm, Tag } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { fetchSquads, createSquad, updateSquadStatus, deleteSquad } from '../../features/squads/squadSlice';
import CreateSquadModal from '../../features/squads/CreateSquadModal';

const { Title, Text } = Typography;
const { Option } = Select;

const SquadManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ACTIVE');
    const dispatch = useDispatch();
    const { items: squads, status, error, pagination } = useSelector((state) => state.squads);

    useEffect(() => {
        // This effect runs when the filter changes.
        dispatch(fetchSquads({ page: 0, size: 10, sort: 'name,asc', status: statusFilter }));
    }, [statusFilter, dispatch]);

    useEffect(() => {
        // This effect runs when a mutation invalidates the status.
        if (status === 'idle') {
            dispatch(fetchSquads({ page: 0, size: 10, sort: 'name,asc', status: statusFilter }));
        }
    }, [status, dispatch, statusFilter]);

    const handleCreate = async (values) => { try { await dispatch(createSquad(values)).unwrap(); setIsModalOpen(false); message.success('Squad created successfully.'); } catch (err) { message.error(`Failed to create squad: ${err}`); } };
    const handleTableChange = (tablePagination, filters, sorter) => { const page = tablePagination.current - 1; const size = tablePagination.pageSize; const sort = sorter.field ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'name,asc'; dispatch(fetchSquads({ page, size, sort, status: statusFilter })); };
    const handleStatusUpdate = (squadId, newStatus) => { dispatch(updateSquadStatus({ squadId, status: newStatus })).unwrap().then(() => message.success('Status updated.')).catch(err => message.error(`Update failed: ${err}`)); };
    const handleDelete = (squadId) => { dispatch(deleteSquad(squadId)).unwrap().then(() => message.success('Squad deleted.')).catch(err => message.error(`Delete failed: ${err}`)); };

    const getMenuItems = (record) => {
        const items = [];
        if (record.status === 'ACTIVE') {
            items.push({ key: 'hold', label: 'Place on Hold', onClick: () => handleStatusUpdate(record.id, 'ON_HOLD') });
            items.push({ key: 'complete', label: 'Mark as Completed', onClick: () => handleStatusUpdate(record.id, 'COMPLETED') });
        }
        if (record.status === 'ON_HOLD') {
            items.push({ key: 'reactivate', label: 'Reactivate', onClick: () => handleStatusUpdate(record.id, 'ACTIVE') });
            items.push({ key: 'complete', label: 'Mark as Completed', onClick: () => handleStatusUpdate(record.id, 'COMPLETED') });
        }
        if (record.status === 'COMPLETED') {
            items.push({ key: 'reactivate', label: 'Reactivate', onClick: () => handleStatusUpdate(record.id, 'ACTIVE') });
        }
        items.push({ 
            key: 'delete', 
            label: (
                <Popconfirm 
                    title="Delete Squad?" 
                    description="This action is irreversible." 
                    onConfirm={() => handleDelete(record.id)} 
                    okText="Confirm Delete" 
                    cancelText="Cancel"
                >
                    <Text type="danger">Delete</Text>
                </Popconfirm>
            )
        });
        return { items };
    };
    
    const statusTag = (status) => {
        const colors = { ACTIVE: 'green', ON_HOLD: 'orange', COMPLETED: 'blue' };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Squad Name', dataIndex: 'name', key: 'name', sorter: true, render: (text, record) => <Link to={`/admin/squads/${record.id}`}>{text}</Link> },
        // --- Restored Columns ---
        { title: 'Status', dataIndex: 'status', key: 'status', render: statusTag },
        { title: 'Action', key: 'action', render: (_, record) => (<Dropdown menu={getMenuItems(record)} trigger={['click']}><Button type="text" icon={<MoreOutlined />} /></Dropdown>) },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2}>Squad Management</Title>
                <Space>
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                        <Option value="ACTIVE">Active</Option>
                        <Option value="ON_HOLD">On Hold</Option>
                        <Option value="COMPLETED">Completed</Option>
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Create New Squad</Button>
                </Space>
            </div>
            <CreateSquadModal open={isModalOpen} onCreate={handleCreate} onCancel={() => setIsModalOpen(false)} />
            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table columns={columns} dataSource={squads} rowKey="id" loading={status === 'loading'} onChange={handleTableChange} pagination={{ current: pagination.currentPage + 1, pageSize: pagination.size, total: pagination.totalElements }} />
        </div>
    );
};

export default SquadManagementPage;