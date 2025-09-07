// src/layouts/MainLayout.js
import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import GlobalSearchBar from '../components/GlobalSearchBar';
import NotificationBell from '../components/NotificationBell'; // 1. Import

const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => { dispatch(logout()); };

    const menuItems = [
        { key: '/hm/dashboard', label: <Link to="/hm/dashboard">Dashboard</Link>, isVisible: user?.role === 'HM' },
        { key: '/hm/demands', label: <Link to="/hm/demands">My Demands</Link>, isVisible: user?.role === 'HM' },
        { key: '/talent-pool', label: <Link to="/talent-pool">Talent Pool</Link>, isVisible: user?.role === 'HM' },
        { key: '/interviewer/assignments', label: <Link to="/interviewer/assignments">Relevant Demands</Link>, isVisible: true, },
        { key: '/admin/users', label: <Link to="/admin/users">User Management</Link>, isVisible: user?.role === 'HM' },
        { key: '/admin/squads', label: <Link to="/admin/squads">Squad Management</Link>, isVisible: user?.role === 'HM' },
    ];

    // --- THIS IS THE FIX ---
    // Filter the items first, then map them to remove the custom isVisible prop
    const finalMenuItems = menuItems
        .filter(item => item.isVisible)
        .map(({ isVisible, ...rest }) => rest); // Destructure to remove isVisible

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '50px' }}>TalentLink</div>
                <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} items={finalMenuItems} style={{ flex: 1, borderBottom: 'none' }} />

                <Space style={{ marginLeft: 'auto' }}>
                    {user?.role === 'HM' && <GlobalSearchBar />}
                    <NotificationBell /> {/* 2. Add Component */}

                    <Button type="primary" onClick={handleLogout}>Logout</Button>
                </Space>
            </Header>
            <Content style={{ padding: '24px 50px' }}><div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{children}</div></Content>
        </Layout>
    );
};

export default MainLayout;