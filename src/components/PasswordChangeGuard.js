// src/components/PasswordChangeGuard.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd'; // 引入 Spin 组件用于加载提示

const PasswordChangeGuard = ({ children }) => {
    // 同时获取 isAuthenticated 和 user 状态
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    // --- START FIX ---
    // 关键修复点：如果已经认证，但 user 对象尚未从 token 中解析出来
    // (这在登录后的瞬间可能会发生)，则显示一个加载指示器，
    // 阻止子组件（例如 HMDashboardPage）过早渲染和触发 useEffect。
    if (isAuthenticated && !user) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }
    // --- END FIX ---

    // 如果需要修改密码，并且当前不在修改密码页，则强制跳转
    if (user?.passwordChangeRequired && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" state={{ from: location }} replace />;
    }

    // 如果不需要修改密码，但用户试图访问修改密码页，则跳转回主页
    if (!user?.passwordChangeRequired && location.pathname === '/change-password') {
        return <Navigate to="/" replace />;
    }

    // 所有检查通过，渲染子组件
    return children;
};

export default PasswordChangeGuard;