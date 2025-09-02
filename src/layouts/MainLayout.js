// src/layouts/MainLayout.js
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => { dispatch(logout()); };

    const menuItems = [
        {
            key: '/interviewer/assignments',
            label: <Link to="/interviewer/assignments">相关需求</Link>, // 1. Change text
            isVisible: true,
        },
        {
            key: '/hm/dashboard',
            label: <Link to="/hm/dashboard">招聘需求管理</Link>,
            isVisible: user?.role === 'HM',
        },
        {
            key: '/admin/users',
            label: <Link to="/admin/users">用户管理</Link>,
            isVisible: user?.role === 'HM',
        },
    ];

    const visibleMenuItems = menuItems.filter(item => item.isVisible);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '50px' }}>TalentLink</div>
                <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} items={visibleMenuItems} style={{ flex: 1, borderBottom: 'none' }} />
                <Button type="primary" onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</Button>
            </Header>
            <Content style={{ padding: '24px 50px' }}><div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{children}</div></Content>
        </Layout>
    );
};

export default MainLayout;