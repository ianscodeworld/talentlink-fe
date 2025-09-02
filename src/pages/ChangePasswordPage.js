// src/pages/ChangePasswordPage.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { updateMyPassword } from '../features/auth/authSlice';

const { Title, Paragraph } = Typography;

const ChangePasswordPage = () => {
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            await dispatch(updateMyPassword({ newPassword: values.password })).unwrap();
            message.success('Password changed successfully! Please log in with your new password.', 5);
            // The slice already handles logging out, ProtectedRoute will redirect to /login
        } catch (err) {
            message.error(`Failed to change password: ${err}`);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 450 }}>
                <Title level={2} style={{ textAlign: 'center' }}>Change Your Password</Title>
                <Paragraph style={{ textAlign: 'center', marginBottom: '24px' }}>
                    For security reasons, you must change your temporary password before proceeding.
                </Paragraph>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[{ required: true, message: 'Please input your new password!' }, { min: 6, message: 'Password must be at least 6 characters.' }]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm New Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Set New Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;