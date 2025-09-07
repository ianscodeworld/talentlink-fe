// src/pages/admin/SquadDetailPage.js
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSquadById, clearSelectedSquad, updateSquadStatus, deleteSquad } from '../../features/squads/squadSlice';
import { Spin, Alert, Typography, Descriptions, Divider, Button, Row, Col, Statistic, Table, Card, Space, Dropdown, Popconfirm, Tag, message } from 'antd';
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SquadDetailPage = () => {
    const { squadId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedSquad, detailStatus, detailError } = useSelector((state) => state.squads);

    useEffect(() => {
        if (squadId) {
            dispatch(fetchSquadById(squadId));
        }
        return () => {
            dispatch(clearSelectedSquad());
        };
    }, [squadId, dispatch]);

    const handleStatusUpdate = (newStatus) => {
        dispatch(updateSquadStatus({ squadId, status: newStatus }))
            .unwrap()
            .then(() => message.success('Status updated.'))
            .catch(err => message.error(`Update failed: ${err}`));
    };

    const handleDelete = () => {
        dispatch(deleteSquad(squadId))
            .unwrap()
            .then(() => {
                message.success('Squad deleted successfully.');
                navigate('/admin/squads'); // Navigate back to the list after deletion
            })
            .catch(err => message.error(`Delete failed: ${err}`));
    };

    const getMenuItems = (record) => {
        if (!record) return { items: [] };
        const items = [];
        if (record.status === 'ACTIVE') {
            items.push({ key: 'hold', label: 'Place on Hold', onClick: () => handleStatusUpdate('ON_HOLD') });
            items.push({ key: 'complete', label: 'Mark as Completed', onClick: () => handleStatusUpdate('COMPLETED') });
        }
        if (record.status === 'ON_HOLD') {
            items.push({ key: 'reactivate', label: 'Reactivate', onClick: () => handleStatusUpdate('ACTIVE') });
            items.push({ key: 'complete', label: 'Mark as Completed', onClick: () => handleStatusUpdate('COMPLETED') });
        }
        if (record.status === 'COMPLETED') {
            items.push({ key: 'reactivate', label: 'Reactivate', onClick: () => handleStatusUpdate('ACTIVE') });
        }
        // The Popconfirm is now part of the item's label, which is a standard antd pattern
        items.push({ 
            key: 'delete', 
            label: (
                <Popconfirm 
                    title="Delete Squad?" 
                    description="This action cannot be undone." 
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <Text type="danger">Delete</Text>
                </Popconfirm>
            )
        });
        return { items };
    };
    
    const statusTag = (status) => {
        const colors = { ACTIVE: 'green', ON_HOLD: 'orange', COMPLETED: 'blue' };
        return <Tag color={colors[status]}>{status}</Tag>;
    };

    if (detailStatus === 'loading' || !selectedSquad) {
        return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
    }
    if (detailStatus === 'failed') {
        return <Alert message={`Error: ${detailError}`} type="error" />;
    }

    const { name, totalDemands, totalCandidates, candidateStatusCounts, demands, status } = selectedSquad;
    const demandColumns = [
        { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle', render: (text, record) => <Link to={`/hm/demands/${record.id}`}>{text}</Link> },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Candidates', dataIndex: 'candidateCount', key: 'candidateCount' },
        { title: 'Hired', dataIndex: 'hiredCount', key: 'hiredCount' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                    <Link to="/admin/squads">
                        <Button type="text" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0 }}>Back to Squad List</Button>
                    </Link>
                    <Title level={2} style={{ marginTop: 0 }}>{name} {statusTag(status)}</Title>
                </div>
                <Dropdown menu={getMenuItems(selectedSquad)} trigger={['click']}>
                    <Button icon={<MoreOutlined />}>Actions</Button>
                </Dropdown>
            </div>
            
            <Card title="Overall Statistics" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    <Col span={8}><Statistic title="Total Associated Demands" value={totalDemands} /></Col>
                    <Col span={8}><Statistic title="Total Candidates in Pipeline" value={totalCandidates} /></Col>
                </Row>
                <Divider />
                <Title level={5}>Candidate Status Breakdown</Title>
                <Row gutter={16}>
                    {Object.entries(candidateStatusCounts || {}).map(([status, count]) => (
                        <Col span={8} key={status}><Statistic title={status} value={count} /></Col>
                    ))}
                </Row>
            </Card>

            <Title level={3}>Associated Demands</Title>
            <Table columns={demandColumns} dataSource={demands} rowKey="id" pagination={false} />
        </div>
    );
};

export default SquadDetailPage;