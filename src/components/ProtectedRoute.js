// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, status } = useSelector((state) => state.auth);
    const location = useLocation();

    // 状态 1: 登录流程正在进行中，显示加载动画
    if (status === 'loading' || (isAuthenticated && !user)) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
    }

    // 状态 2: 未登录，重定向到登录页
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 状态 3: 已登录，但需要修改密码，并且当前不在修改密码页，则强制跳转
    if (user.passwordChangeRequired && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }
    
    // 状态 4: 已登录，且无需修改密码，但用户试图访问修改密码页，则跳转回主页
    if (!user.passwordChangeRequired && location.pathname === '/change-password') {
         return <Navigate to="/" replace />;
    }

    // 状态 5: 所有检查通过，允许访问目标页面
    return children;
};

export default ProtectedRoute;