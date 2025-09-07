// src/pages/HMDashboardPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHmSummary } from '../features/dashboard/hmDashboardSlice';
import { Spin, Alert, Typography, Row, Col, Card, Statistic, List, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { SolutionOutlined } from '@ant-design/icons';
import SquadSummary from '../features/dashboard/SquadSummary';

const { Title, Text, Paragraph } = Typography;

const HMDashboardPage = () => {
    const dispatch = useDispatch();
    const { summary, status, error } = useSelector((state) => state.hmDashboard);

    useEffect(() => {
        // Always refetches data every time you visit the page
        dispatch(fetchHmSummary());
    }, [dispatch]);

    if (status === 'loading' || !summary) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    if (status === 'failed') {
        return <Alert message={`Error loading dashboard: ${error}`} type="error" />;
    }
    
    const { squadsSummary, candidateFunnel, weeklyInterviewerWorkload, demandsWithoutCandidates, recentFeedbacks } = summary;
    const totalInFunnel = Object.values(candidateFunnel || {}).reduce((sum, count) => sum + count, 0);

    return (
        <div>
            <Title level={2}>HM Dashboard</Title>
            <Paragraph type="secondary">
                Welcome! Here is the strategic overview of your ongoing recruitment activities.
            </Paragraph>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card><Statistic title="Total in Pipeline" value={totalInFunnel} prefix={<SolutionOutlined />} /></Card>
                </Col>
                {Object.entries(candidateFunnel || {}).map(([stage, count]) => (
                    <Col xs={24} sm={12} md={6} key={stage}>
                        <Card><Statistic title={stage} value={count} /></Card>
                    </Col>
                ))}
            </Row>

            {squadsSummary && squadsSummary.length > 0 && <SquadSummary data={squadsSummary} />}

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={8}>
                    <Card title="Weekly Interviewer Workload" styles={{ header: {backgroundColor: '#fafafa'} }} style={{height: '100%'}}>
                        {weeklyInterviewerWorkload && weeklyInterviewerWorkload.length > 0 ? (
                            <List
                                dataSource={weeklyInterviewerWorkload}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.interviewerName}
                                            description={`Completed ${item.feedbackCount} interviews this week`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : <Empty description="No feedback submitted this week." />}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Demands Needing Attention" styles={{ header: {backgroundColor: '#fafafa'} }} style={{height: '100%'}}>
                        {demandsWithoutCandidates && demandsWithoutCandidates.length > 0 ? (
                             <List
                                dataSource={demandsWithoutCandidates}
                                renderItem={item => (
                                    <List.Item>
                                        <Text>⦿</Text>
                                        <Link to={`/hm/demands/${item.id}`} style={{ marginLeft: 8 }}>{item.jobTitle}</Link>
                                    </List.Item>
                                )}
                            />
                        ) : <Empty description="All demands have candidates." />}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title="Recent Feedback Activity" 
                        styles={{ 
                            header: {backgroundColor: '#fafafa'},
                            body: { maxHeight: '400px', overflowY: 'auto' }
                        }}
                        style={{height: '100%'}}
                    >
                         {recentFeedbacks && recentFeedbacks.length > 0 ? (
                            <List
                                dataSource={recentFeedbacks}
                                renderItem={item => (
                                    <List.Item 
                                        className="dashboard-list-item"
                                        extra={
                                            <Text type="secondary" style={{ flexShrink: 0, marginLeft: 16 }}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Text>
                                        }
                                    >
                                        <Link to={`/hm/demands/${item.demandId}`} state={{ highlightedCandidateId: item.candidateId }} style={{ display: 'block', width: '100%'}}>
                                            <List.Item.Meta
                                                title={<Text strong>{item.candidateName} for {item.jobTitle}</Text>}
                                                description={
                                                    <>
                                                        <Paragraph ellipsis={{ rows: 2 }}>{item.evaluationText}</Paragraph>
                                                        <Text>by {item.interviewerName} - </Text>
                                                        <Tag color={item.recommendation === 'PASS' ? 'success' : 'error'}>
                                                            {item.recommendation}
                                                        </Tag>
                                                    </>
                                                }
                                            />
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        ) : <Empty description="No recent feedback." />}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HMDashboardPage;