// src/pages/DemandDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDemandById, clearSelectedDemand, addCandidate, updateCandidateStatus, submitFeedback } from '../features/demands/demandSlice';
import { fetchVendors } from '../features/vendors/vendorSlice';
import { generateVendorEmail, clearEmailSummary } from '../features/candidates/emailSummarySlice';
import { Spin, Alert, Typography, Descriptions, Divider, Button, Table, Tag, message, Space, Card, List, Popconfirm } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import AddCandidateModal from '../features/candidates/AddCandidateModal';
import FeedbackModal from '../features/candidates/FeedbackModal';
import CandidateHistoryDrawer from '../features/candidates/CandidateHistoryDrawer';
import GenerateEmailModal from '../features/candidates/GenerateEmailModal';

const { Title, Paragraph, Text } = Typography;

const DemandDetailPage = () => {
    const { demandId } = useParams();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { selectedDemand, detailStatus, detailError } = useSelector((state) => state.demands);
    const { items: vendors, status: vendorStatus } = useSelector((state) => state.vendors);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [feedbackCandidate, setFeedbackCandidate] = useState(null);
    const [historyCandidate, setHistoryCandidate] = useState(null);
    const [emailCandidate, setEmailCandidate] = useState(null);

    useEffect(() => {
        if (demandId && (detailStatus === 'idle' || selectedDemand?.id !== Number(demandId))) {
            dispatch(fetchDemandById(demandId));
        }
        if (vendorStatus === 'idle') {
            dispatch(fetchVendors());
        }
    }, [demandId, dispatch, vendorStatus, detailStatus, selectedDemand?.id]);

    useEffect(() => {
        return () => {
            dispatch(clearSelectedDemand());
        };
    }, [dispatch, demandId]);

    const handleAddCandidate = async (values) => { try { await dispatch(addCandidate({ demandId, candidateData: values })).unwrap(); message.success('Candidate added successfully!'); setAddModalOpen(false); } catch (err) { message.error(`Failed to add candidate: ${err}`); } };
    const handleStatusUpdate = async (candidateId, newStatus) => { try { await dispatch(updateCandidateStatus({ candidateId, status: newStatus })).unwrap(); message.success(`Candidate status updated to ${newStatus}`); } catch (err) { message.error(`Failed to update status: ${err}`); } };
    const handleSubmitFeedback = async (values) => { try { await dispatch(submitFeedback({ candidateId: feedbackCandidate.id, feedbackData: values })).unwrap(); message.success('Feedback submitted successfully!'); setFeedbackCandidate(null); } catch (err) { message.error(`Failed to submit feedback: ${err}`); } };
    
    const handleGenerateEmail = (candidate) => {
        setEmailCandidate(candidate);
        dispatch(generateVendorEmail(candidate.id));
    };

    const handleCloseEmailModal = () => {
        setEmailCandidate(null);
        dispatch(clearEmailSummary());
    };

    const expandedRowRender = (record) => { 
        if (!record.feedbacks || record.feedbacks.length === 0) { 
            return <Text>No feedback submitted yet.</Text>; 
        } 
        return ( 
            <List 
                header={<Text strong>Interview Feedback</Text>} 
                dataSource={record.feedbacks} 
                renderItem={(item) => ( 
                    <List.Item> 
                        <Card size="small" title={`Round ${item.interviewRound} - by ${item.interviewerName}`} style={{ width: '100%' }}> 
                            <p><Text strong>Recommendation: </Text><Tag color={item.recommendation === 'PASS' ? 'success' : 'error'}>{item.recommendation}</Tag></p> 
                            <p><Text strong>Evaluation: </Text>{item.evaluationText}</p> 
                            <Text type="secondary">Submitted at: {new Date(item.createdAt).toLocaleString()}</Text> 
                        </Card> 
                    </List.Item> 
                )} 
            /> 
        ); 
    };

    const candidateColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: status => <Tag>{status}</Tag> },
        { title: 'Current Round', dataIndex: 'currentInterviewRound', key: 'currentInterviewRound' },
        { 
            title: 'Action', 
            key: 'action', 
            render: (_, record) => {
                const historyButton = <Button type="link" onClick={() => setHistoryCandidate(record)} style={{ padding: 0 }}>History</Button>;
                
                if (user?.role === 'HM') {
                    const finalistActions = (
                        <Space size="middle">
                            {historyButton}
                            <Button type="link" icon={<MailOutlined />} onClick={() => handleGenerateEmail(record)} style={{ padding: 0 }}>Email</Button>
                            <Popconfirm title="Confirm hire?" onConfirm={() => handleStatusUpdate(record.id, 'HIRED')}><Button type="link" style={{ padding: 0 }}>Hire</Button></Popconfirm>
                            <Popconfirm title="Place on hold?" onConfirm={() => handleStatusUpdate(record.id, 'ON_HOLD')}><Button type="link" style={{ padding: 0 }}>On Hold</Button></Popconfirm>
                        </Space>
                    );
                    const defaultActions = (
                        <Space size="middle">
                            {historyButton}
                            <Button type="link" icon={<MailOutlined />} onClick={() => handleGenerateEmail(record)} style={{ padding: 0 }}>Email</Button>
                            <Popconfirm title="Advance?" onConfirm={() => handleStatusUpdate(record.id, 'PASSED_WAITING_FOR_INTERVIEW')}><Button type="link" style={{ padding: 0 }}>Advance</Button></Popconfirm>
                            <Popconfirm title="Reject?" onConfirm={() => handleStatusUpdate(record.id, 'REJECTED')}><Button type="link" danger style={{ padding: 0 }}>Reject</Button></Popconfirm>
                        </Space>
                    );
                    return record.status === 'FINALIST' ? finalistActions : defaultActions;
                }

                if (user?.role === 'INTERVIEWER') {
                    return (
                        <Space>
                            {historyButton}
                            <Button type="link" onClick={() => setFeedbackCandidate(record)} style={{ padding: 0 }}>Submit Feedback</Button>
                        </Space>
                    );
                }
                return null;
            }
        }
    ];
    
    if (detailStatus === 'loading' || (detailStatus === 'idle' && !selectedDemand)) { return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />; }
    if (detailStatus === 'failed') { return <Alert message={`Error: ${detailError?.message || 'Failed to fetch demand details'}`} type="error" />; }
    if (!selectedDemand) { return <Alert message="Demand not found." type="warning" />; }
    
    return (
        <div>
            <Link to={user?.role === 'HM' ? '/hm/dashboard' : '/interviewer/assignments'}><Button type="text" icon={<ArrowLeftOutlined />}>Back to Dashboard</Button></Link>
            <Descriptions title="Demand Details" bordered style={{ marginTop: 24 }}>
                <Descriptions.Item label="Job Title">{selectedDemand.jobTitle}</Descriptions.Item>
                <Descriptions.Item label="Created By">{selectedDemand.createdByName}</Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(selectedDemand.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag>{selectedDemand.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Total Rounds">{selectedDemand.totalInterviewRounds}</Descriptions.Item>
                <Descriptions.Item label="Description"><Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>{selectedDemand.description}</Paragraph></Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={3}>Candidates</Title>
                {user?.role === 'HM' && <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>Add Candidate</Button>}
            </div>
            <AddCandidateModal open={addModalOpen} onCreate={handleAddCandidate} onCancel={() => setAddModalOpen(false)} vendors={vendors} loading={vendorStatus === 'loading'} />
            <FeedbackModal open={!!feedbackCandidate} onFeedbackSubmit={handleSubmitFeedback} onCancel={() => setFeedbackCandidate(null)} candidate={feedbackCandidate} />
            <CandidateHistoryDrawer open={!!historyCandidate} onClose={() => setHistoryCandidate(null)} candidate={historyCandidate} />
            <GenerateEmailModal open={!!emailCandidate} onClose={handleCloseEmailModal} candidateName={emailCandidate?.name} />
            <Table columns={candidateColumns} dataSource={selectedDemand.candidates} rowKey="id" expandable={{ expandedRowRender }} pagination={false} />
        </div>
    );
};

export default DemandDetailPage;