// src/pages/admin/UserManagementPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Alert, Typography, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { fetchInterviewers, createUser, deleteUser, updateUser } from '../../features/users/userSlice';
import CreateUserModal from '../../features/users/CreateUserModal';
import EditUserModal from '../../features/users/EditUserModal'; // 1. Import Edit Modal

const { Title } = Typography;

const UserManagementPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // 2. State for editing
    const dispatch = useDispatch();
    const { interviewers, status, error } = useSelector((state) => state.users);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchInterviewers());
        }
    }, [status, dispatch]);

    const handleCreate = async (values) => { try { await dispatch(createUser(values)).unwrap(); setIsCreateModalOpen(false); message.success('User created successfully.'); } catch (err) { message.error(`Failed to create user: ${err}`); } };
    const handleDelete = async (userId) => { try { await dispatch(deleteUser(userId)).unwrap(); message.success('User deleted successfully.'); } catch (err) { message.error(`Failed to delete user: ${err}`); } };
    
    // 3. Handler for updating
    const handleUpdate = async (userId, values) => {
        try {
            await dispatch(updateUser({ userId, userData: values })).unwrap();
            setEditingUser(null);
            message.success('User updated successfully.');
        } catch (err) {
            message.error(`Failed to update user: ${err}`);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => setEditingUser(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2}>User Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                    Create New User
                </Button>
            </div>
            
            <CreateUserModal
                open={isCreateModalOpen}
                onCreate={handleCreate}
                onCancel={() => setIsCreateModalOpen(false)}
            />

            {/* 4. Render the Edit Modal */}
            <EditUserModal
                open={!!editingUser}
                onUpdate={handleUpdate}
                onCancel={() => setEditingUser(null)}
                initialUserData={editingUser}
            />

            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table
                columns={columns}
                dataSource={interviewers}
                rowKey="id"
                loading={status === 'loading'}
            />
        </div>
    );
};

export default UserManagementPage;