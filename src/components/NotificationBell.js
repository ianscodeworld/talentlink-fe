// src/components/NotificationBell.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popover, Badge, List, Spin, Empty, Button, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { fetchNotifications, markNotificationAsRead } from '../features/notifications/notificationSlice';

const { Text } = Typography;

const NotificationList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, status } = useSelector(state => state.notifications);

    const handleItemClick = (item) => {
        if (!item.isRead) {
            dispatch(markNotificationAsRead(item.id));
        }
        navigate(item.linkUrl);
    };

    if (status === 'loading') return <Spin />;
    if (items.length === 0) return <Empty description="No new notifications" />;

    return (
        <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={item => (
                <List.Item 
                    onClick={() => handleItemClick(item)} 
                    style={{ cursor: 'pointer', backgroundColor: item.isRead ? '#fff' : '#e6f7ff' }}
                >
                    <List.Item.Meta
                        title={item.content}
                        description={new Date(item.createdAt).toLocaleString()}
                    />
                </List.Item>
            )}
            style={{ maxHeight: '400px', overflowY: 'auto', width: '350px' }}
        />
    );
};

const NotificationBell = () => {
    const dispatch = useDispatch();
    const { unreadCount } = useSelector(state => state.notifications);

    useEffect(() => {
        // Fetch notifications when the component mounts
        dispatch(fetchNotifications({ page: 0, size: 10, sort: 'createdAt,desc' }));
        
        // Optional: Set up polling to fetch notifications periodically
        const interval = setInterval(() => {
            dispatch(fetchNotifications({ page: 0, size: 10, sort: 'createdAt,desc' }));
        }, 60000); // Poll every 60 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [dispatch]);

    return (
        <Popover
            content={<NotificationList />}
            title={<Text strong>Notifications</Text>}
            trigger="click"
            placement="bottomRight"
        >
            <Badge count={unreadCount}>
                <BellOutlined style={{ fontSize: '20px', color: '#fff' }} />
            </Badge>
        </Popover>
    );
};

export default NotificationBell;