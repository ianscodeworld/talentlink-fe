// src/pages/LoginPage.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';

const { Title } = Typography;

const LoginPage = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, status, error } = useSelector((state) => state.auth);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // This function is only called on successful validation
        console.log('Form validation successful, attempting login...');
        dispatch(loginUser(values));
    };

    // --- START: ADDED FOR DEBUGGING ---
    const onFinishFailed = (errorInfo) => {
        // This function is called when validation fails
        console.log('Form validation failed:', errorInfo);
    };
    // --- END: ADDED FOR DEBUGGING ---
    
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>TalentLink Login</Title>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed} // Add the failure handler
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    {status === 'failed' && error && (
                         <Alert message={error.message || 'Login failed!'} type="error" showIcon style={{marginBottom: '24px'}}/>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={status === 'loading'}>
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;