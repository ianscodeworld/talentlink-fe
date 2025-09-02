// src/pages/HomePage.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { logout } from '../features/auth/authSlice';

const HomePage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        // 登出后，ProtectedRoute 会自动处理重定向到 /login
    };

    // 如果认证状态还未确定，显示加载
    if (isAuthenticated && !user) {
        return <Spin size="large" style={{ display: 'block', marginTop: '100px' }} />;
    }
    
    // 如果已认证且有用户信息，进行角色判断
    if (isAuthenticated && user) {
        // 根据 API 合约，角色字段为 `role`
        if (user.role === 'HM') {
            return <Navigate to="/hm/dashboard" replace />;
        }

        if (user.role === 'INTERVIEWER') {
            return <Navigate to="/interviewer/assignments" replace />;
        }

        // 角色无效的 fallback UI
        return (
            <Result
                status="error"
                title="Invalid User Role"
                subTitle="Your user role is not configured correctly. Please contact support."
                extra={[
                    <Button type="primary" key="logout" onClick={handleLogout}>
                        Logout
                    </Button>,
                ]}
            />
        );
    }

    // 如果最终没有认证，ProtectedRoute 会处理，但作为双重保险
    return <Navigate to="/login" replace />;
};

export default HomePage;