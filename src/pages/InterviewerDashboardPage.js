// src/pages/InterviewerDashboardPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRelevantDemands } from '../features/demands/relevantDemandsSlice';
import { Spin, Alert, Typography, List, Card, Tag, Pagination } from 'antd';

const { Title, Paragraph } = Typography;

const InterviewerDashboardPage = () => {
    const dispatch = useDispatch();
    const { items: demands, status, error, pagination } = useSelector((state) => state.relevantDemands);

    useEffect(() => {
        // --- THIS IS THE CHANGE ---
        // Removed "if (status === 'idle')". Always fetches on mount.
        dispatch(fetchRelevantDemands({ page: 0, size: 9, sort: 'createdAt,desc' }));
    }, [dispatch]);
    // --- END CHANGE ---

    const handlePageChange = (page, pageSize) => {
        dispatch(fetchRelevantDemands({ page: page - 1, size: pageSize, sort: 'createdAt,desc' }));
    };

    if (status === 'loading' && demands.length === 0) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <Title level={2}>Relevant Demands</Title>
            <Paragraph type="secondary">
                Showing open demands that match your specialties. You can browse candidates and submit feedback directly.
            </Paragraph>
            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <List grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }} dataSource={demands} loading={status === 'loading'} renderItem={(demand) => ( <List.Item> <Link to={`/hm/demands/${demand.id}`}> <Card hoverable title={demand.jobTitle}> <Paragraph><strong>Status:</strong> <Tag>{demand.status}</Tag></Paragraph> <Paragraph><strong>Created By:</strong> {demand.createdByName}</Paragraph> </Card> </Link> </List.Item> )} />
            <Pagination style={{ marginTop: 24, textAlign: 'center' }} current={pagination.currentPage + 1} pageSize={pagination.size} total={pagination.totalElements} onChange={handlePageChange} showSizeChanger={false} />
        </div>
    );
};

export default InterviewerDashboardPage;