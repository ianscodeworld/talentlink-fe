// src/pages/admin/UserManagementPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Alert, Typography, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchInterviewers, createUser } from '../../features/users/userSlice';
import CreateUserModal from '../../features/users/CreateUserModal';

const { Title } = Typography;

const UserManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { interviewers, status, error } = useSelector((state) => state.users);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchInterviewers());
        }
    }, [status, dispatch]);

    const handleCreate = async (values) => {
        try {
            const resultAction = await dispatch(createUser(values)).unwrap();
            setIsModalOpen(false);
            // 显示包含临时密码的成功提示
            Modal.success({
                title: 'User Created Successfully',
                content: (
                    <div>
                        <p>A new account has been created for <strong>{resultAction.name}</strong>.</p>
                        <p>Please provide them with the following temporary password:</p>
                        <p style={{ background: '#f0f2f5', padding: '8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {resultAction.temporaryPassword}
                        </p>
                    </div>
                ),
            });
        } catch (err) {
            // 错误提示已由 Thunk 和 message 组件处理，这里只记录日志
            console.error('Failed to create user:', err);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2}>Interviewer Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Create New Interviewer
                </Button>
            </div>
            
            <CreateUserModal
                open={isModalOpen}
                onCreate={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            />

            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table
                columns={columns}
                dataSource={interviewers}
                rowKey="id"
                loading={status === 'loading'}
                // For simplicity, this table is not paginated yet, but can be easily added.
            />
        </div>
    );
};

export default UserManagementPage;