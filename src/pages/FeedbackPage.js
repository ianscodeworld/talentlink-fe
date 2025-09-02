// src/pages/FeedbackPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Button, Input, Radio, Card, Typography, message, Divider } from 'antd';
import { submitFeedback } from '../features/interviews/interviewSlice';

const { Title, Paragraph, Text } = Typography;

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    
    // 从路由状态中获取传递过来的任务信息，避免了额外的 API 请求
    const { assignment } = location.state || {};

    // 如果没有任务信息（例如，直接访问URL），则重定向
    if (!assignment) {
        navigate('/interviewer/assignments');
        return null;
    }

    const onFinish = async (values) => {
        const feedbackData = {
            evaluationText: values.evaluationText,
            recommendation: values.recommendation,
        };

        try {
            await dispatch(submitFeedback({
                assignmentId: assignment.assignmentId,
                candidateId: assignment.candidateId,
                feedbackData,
            })).unwrap();
            
            message.success('Feedback submitted successfully!');
            navigate('/interviewer/assignments'); // 提交成功后返回列表页
        } catch (err) {
            message.error(`Failed to submit feedback: ${err.message}`);
        }
    };

    return (
        <Card>
            <Title level={2}>Submit Feedback for {assignment.candidateName}</Title>
            <Paragraph>
                <Text strong>Job Title: </Text>{assignment.jobTitle} <br/>
                <Text strong>Interview Round: </Text>{assignment.interviewRound}
            </Paragraph>
            <Divider />
            <Title level={4}>Resume Summary</Title>
            <Paragraph style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
                {assignment.resumeSummary || 'No summary provided.'}
            </Paragraph>
            <Divider />
            
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="evaluationText"
                    label={<Title level={4}>Evaluation</Title>}
                    rules={[{ required: true, message: 'Please provide your evaluation.' }]}
                >
                    <Input.TextArea rows={8} placeholder="Enter your detailed evaluation of the candidate..." />
                </Form.Item>

                <Form.Item
                    name="recommendation"
                    label={<Title level={4}>Recommendation</Title>}
                    rules={[{ required: true, message: 'Please select a recommendation.' }]}
                >
                    <Radio.Group>
                        <Radio.Button value="PASS">Pass</Radio.Button>
                        <Radio.Button value="FAIL">Fail</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Feedback
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FeedbackPage;