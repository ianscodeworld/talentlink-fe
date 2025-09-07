// src/pages/DemandDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchDemandById, 
    clearSelectedDemand, 
    addCandidate, 
    updateCandidate,
    updateCandidateStatus, 
    submitFeedback, 
    updateCandidateRounds,
    updateDemand,
    deleteDemand 
} from '../features/demands/demandSlice';
import { fetchVendors } from '../features/vendors/vendorSlice';
import { generateVendorEmail, clearEmailSummary } from '../features/candidates/emailSummarySlice';
import { 
    Spin, Alert, Typography, Descriptions, Divider, Button, Table, Tag, 
    message, Space, Card, List, Popconfirm, Row, Col, InputNumber, Dropdown, Modal, Progress
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, MailOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddCandidateModal from '../features/candidates/AddCandidateModal';
import EditDemandModal from '../features/demands/EditDemandModal';
import EditCandidateModal from '../features/candidates/EditCandidateModal';
import FeedbackModal from '../features/candidates/FeedbackModal';
import CandidateHistoryDrawer from '../features/candidates/CandidateHistoryDrawer';
import GenerateEmailModal from '../features/candidates/GenerateEmailModal';

const { Title, Paragraph, Text } = Typography;

const DemandDetailPage = () => {
    const { demandId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);
    const { selectedDemand, detailStatus, detailError } = useSelector((state) => state.demands);
    const { items: vendors, status: vendorStatus } = useSelector((state) => state.vendors);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [isEditDemandModalOpen, setIsEditDemandModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [feedbackCandidate, setFeedbackCandidate] = useState(null);
    const [historyCandidate, setHistoryCandidate] = useState(null);
    const [emailCandidate, setEmailCandidate] = useState(null);
    const [pendingRounds, setPendingRounds] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        const idToHighlight = location.state?.highlightedCandidateId;
        if (idToHighlight) {
            setHighlightedId(idToHighlight);
            const timer = setTimeout(() => {
                setHighlightedId(null);
                window.history.replaceState({}, document.title);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    useEffect(() => {
        if (demandId && demandId !== 'undefined') {
            dispatch(fetchDemandById(demandId));
        }
        if (vendorStatus === 'idle') {
            dispatch(fetchVendors());
        }
    }, [demandId, dispatch, vendorStatus]);

    useEffect(() => {
        return () => {
            dispatch(clearSelectedDemand());
        };
    }, [dispatch, demandId]);

    const handleAddCandidate = async (values) => { try { await dispatch(addCandidate({ demandId, candidateData: values })).unwrap(); message.success('Candidate added successfully!'); setAddModalOpen(false); dispatch(fetchDemandById(demandId)); } catch (err) { message.error(`Failed to add candidate: ${err}`); } };
    const handleUpdateDemand = async (id, values) => { try { await dispatch(updateDemand({ demandId: id, demandData: values })).unwrap(); message.success('Demand updated successfully!'); setIsEditDemandModalOpen(false); dispatch(fetchDemandById(demandId)); } catch (err) { message.error(`Failed to update demand: ${err}`); } };
    const handleDeleteDemand = async () => { try { await dispatch(deleteDemand(demandId)).unwrap(); message.success('Demand deleted successfully!'); navigate('/hm/demands'); } catch (err) { message.error(`Failed to delete demand: ${err}`); } };
    const handleUpdateCandidate = async (candidateId, values) => { try { await dispatch(updateCandidate({ candidateId, candidateData: values })).unwrap(); message.success('Candidate updated successfully!'); setEditingCandidate(null); } catch (err) { message.error(`Failed to update candidate: ${err}`); } };
    const handleStatusUpdate = async (candidateId, newStatus) => { try { await dispatch(updateCandidateStatus({ candidateId, status: newStatus })).unwrap(); message.success(`Candidate status updated to ${newStatus}`); } catch (err) { message.error(`Failed to update status: ${err}`); } };
    const handleSubmitFeedback = async (values) => { try { await dispatch(submitFeedback({ candidateId: feedbackCandidate.id, feedbackData: values })).unwrap(); message.success('Feedback submitted successfully!'); setFeedbackCandidate(null); dispatch(fetchDemandById(demandId)); } catch (err) { message.error(`Failed to submit feedback: ${err}`); } };
    const handleGenerateEmail = (candidate) => { setEmailCandidate(candidate); dispatch(generateVendorEmail(candidate.id)); };
    const handleCloseEmailModal = () => { setEmailCandidate(null); dispatch(clearEmailSummary()); };
    const handleRoundsChange = (candidateId) => {
        const newRounds = pendingRounds[candidateId];
        if (newRounds > 0) {
            dispatch(updateCandidateRounds({ candidateId, totalRounds: newRounds }))
                .unwrap()
                .then(() => { message.success('Candidate interview rounds updated successfully.'); dispatch(fetchDemandById(demandId)); setPendingRounds(prev => { const newState = { ...prev }; delete newState[candidateId]; return newState; }); })
                .catch(err => message.error(`Failed to update rounds: ${err}`));
        }
    };

    const getRowClassName = (record) => {
        return record.id === highlightedId ? 'highlighted-row' : '';
    };

    const expandedRowRender = (record) => {
        const currentTotalRounds = record.totalRoundsOverride || selectedDemand.totalInterviewRounds;
        const pendingValue = pendingRounds[record.id];
        const isChanged = pendingValue !== undefined && pendingValue !== currentTotalRounds;
        const feedbackList = ( !record.feedbacks || record.feedbacks.length === 0 ) ? <Text>No feedback submitted yet.</Text> : <List header={<Text strong>Interview Feedback</Text>} dataSource={record.feedbacks} renderItem={(item) => ( <List.Item> <Card size="small" title={`Round ${item.interviewRound} - by ${item.interviewerName}`} style={{ width: '100%' }}> <p><Text strong>Recommendation: </Text><Tag color={item.recommendation === 'PASS' ? 'success' : 'error'}>{item.recommendation}</Tag></p> <p><Text strong>Evaluation: </Text>{item.evaluationText}</p> <Text type="secondary">Submitted at: {new Date(item.createdAt).toLocaleString()}</Text> </Card> </List.Item> )} />;
        return ( <Row gutter={16}><Col span={16}>{feedbackList}</Col><Col span={8}>{user?.role === 'HM' && ( <Card size="small" title="Candidate Settings"><Space direction="vertical" style={{ width: '100%' }}><Text strong>Override Total Rounds:</Text><Space.Compact style={{ width: '100%' }}><InputNumber min={1} value={pendingValue ?? currentTotalRounds} onChange={(value) => setPendingRounds(prev => ({ ...prev, [record.id]: value }))} /><Button type="primary" onClick={() => handleRoundsChange(record.id)} disabled={!isChanged}>Submit</Button></Space.Compact></Space></Card> )}</Col></Row> );
    };

    const candidateColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: status => <Tag>{status}</Tag> },
        { title: 'Progress', key: 'progress', render: (_, record) => `${record.currentInterviewRound > 0 ? record.currentInterviewRound - 1 : 0} / ${record.totalRoundsOverride || selectedDemand.totalInterviewRounds}` },
        { title: 'Action', key: 'action', render: (_, record) => {
            const historyButton = <Button type="link" onClick={() => setHistoryCandidate(record)} style={{ padding: 0 }}>History</Button>;
            if (user?.role === 'HM') {
                const editButton = <Button type="link" icon={<EditOutlined />} style={{ padding: 0 }} onClick={() => setEditingCandidate(record)}>Edit</Button>;
                const withdrawButton = <Popconfirm title="Withdraw this candidate?" onConfirm={() => handleStatusUpdate(record.id, 'WITHDRAWN')}><Button type="link" danger style={{ padding: 0 }}>Withdraw</Button></Popconfirm>;
                const emailButton = <Button type="link" icon={<MailOutlined />} onClick={() => handleGenerateEmail(record)} style={{ padding: 0 }}>Email</Button>;
                if (record.status === 'FINALIST') {
                    return ( <Space size="middle"> {historyButton} {editButton} {emailButton} <Popconfirm title="Confirm hire?" onConfirm={() => handleStatusUpdate(record.id, 'HIRED')}><Button type="link" style={{ padding: 0 }}>Hire</Button></Popconfirm> <Popconfirm title="Place on hold?" onConfirm={() => handleStatusUpdate(record.id, 'ON_HOLD')}><Button type="link" style={{ padding: 0 }}>On Hold</Button></Popconfirm> {withdrawButton} </Space> );
                }
                return ( <Space size="middle"> {historyButton} {editButton} {emailButton} <Popconfirm title="Advance?" onConfirm={() => handleStatusUpdate(record.id, 'PASSED_WAITING_FOR_INTERVIEW')}><Button type="link" style={{ padding: 0 }}>Advance</Button></Popconfirm> <Popconfirm title="Reject?" onConfirm={() => handleStatusUpdate(record.id, 'REJECTED')}><Button type="link" danger style={{ padding: 0 }}>Reject</Button></Popconfirm> {withdrawButton} </Space> );
            }
            if (user?.role === 'INTERVIEWER') {
                return ( <Space> {historyButton} <Button type="link" onClick={() => setFeedbackCandidate(record)} style={{ padding: 0 }}>Submit Feedback</Button> </Space> );
            }
            return null;
        }}
    ];
    
    if (detailStatus === 'loading' || (detailStatus === 'idle' && !selectedDemand)) { return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />; }
    if (detailStatus === 'failed') { return <Alert message={`Error: ${detailError?.message || 'Failed to fetch demand details'}`} type="error" />; }
    if (!selectedDemand) { return <Alert message="Demand not found." type="warning" />; }
    
    const demandActionMenuItems = [
        { key: 'edit', label: 'Edit Demand', icon: <EditOutlined />, onClick: () => setIsEditDemandModalOpen(true) },
        { key: 'delete', label: <Text type="danger">Delete Demand</Text>, icon: <DeleteOutlined />, danger: true, onClick: () => { Modal.confirm({ title: 'Are you sure?', content: 'This action cannot be undone.', okText: 'Confirm Delete', okType: 'danger', onOk: handleDeleteDemand }); }},
    ];

    const { requiredPositions, fulfilledPositions } = selectedDemand;
    const hiringProgress = (requiredPositions > 0) ? Math.round((fulfilledPositions / requiredPositions) * 100) : 0;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={'/hm/demands'}><Button type="text" icon={<ArrowLeftOutlined />}>Back to Demand List</Button></Link>
                {user?.role === 'HM' && <Dropdown menu={{ items: demandActionMenuItems }} trigger={['click']}><Button icon={<MoreOutlined />}>Actions</Button></Dropdown>}
            </div>
            <Descriptions title={selectedDemand.jobTitle} bordered style={{ marginTop: 24 }} column={3}>
                <Descriptions.Item label="Created By">{selectedDemand.createdByName}</Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(selectedDemand.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag>{selectedDemand.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Default Rounds">{selectedDemand.totalInterviewRounds}</Descriptions.Item>
                <Descriptions.Item label="Hiring Progress" span={2}>
                    <Space>
                        <Progress percent={hiringProgress} steps={requiredPositions} strokeColor="#52c41a" size="small" />
                        <Text strong>({fulfilledPositions} of {requiredPositions} filled)</Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={3}><Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>{selectedDemand.description}</Paragraph></Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={3}>Candidates</Title>
                {user?.role === 'HM' && <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>Add Candidate</Button>}
            </div>
            <AddCandidateModal open={addModalOpen} onCreate={handleAddCandidate} onCancel={() => setAddModalOpen(false)} demandId={demandId} />
            <EditDemandModal open={isEditDemandModalOpen} onUpdate={handleUpdateDemand} onCancel={() => setIsEditDemandModalOpen(false)} initialData={selectedDemand} />
            <EditCandidateModal open={!!editingCandidate} onUpdate={handleUpdateCandidate} onCancel={() => setEditingCandidate(null)} initialData={editingCandidate} />
            <FeedbackModal open={!!feedbackCandidate} onFeedbackSubmit={handleSubmitFeedback} onCancel={() => setFeedbackCandidate(null)} candidate={feedbackCandidate} />
            <CandidateHistoryDrawer open={!!historyCandidate} onClose={() => setHistoryCandidate(null)} candidate={historyCandidate} />
            <GenerateEmailModal open={!!emailCandidate} onClose={handleCloseEmailModal} candidateName={emailCandidate?.name} />
            <Table columns={candidateColumns} dataSource={selectedDemand.candidates} rowKey="id" expandable={{ expandedRowRender }} pagination={false} rowClassName={getRowClassName} />
        </div>
    );
};
export default DemandDetailPage;