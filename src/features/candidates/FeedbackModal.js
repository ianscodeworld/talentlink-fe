// src/features/candidates/FeedbackModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Typography, Button } from 'antd';
import { useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;

const FeedbackModal = ({ open, onFeedbackSubmit, onCancel, candidate }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector((state) => state.auth); // 获取当前用户信息以判断角色

    // 当模态框打开时，清空上一次的表单内容
    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            setIsSubmitting(true);
            try {
                // onFeedbackSubmit 是从父组件传递过来的
                await onFeedbackSubmit(values);
            } finally {
                // 无论成功或失败，都结束提交状态
                setIsSubmitting(false);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={open}
            title={`Submit Feedback for ${candidate?.name}`}
            onCancel={handleCancel}
            // 使用自定义页脚来控制按钮的加载状态
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={isSubmitting} onClick={handleSubmit}>
                    Submit Feedback
                </Button>,
            ]}
        >
            {/* 功能 2: 明确显示面试轮次 */}
            <Paragraph>
                <Text strong>Interview Round: </Text>
                <Text type="success" style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {candidate?.currentInterviewRound}
                </Text>
            </Paragraph>

            <Form form={form} layout="vertical" name="feedback_form">
                
                {/* 功能 1: HM 代理提交反馈的输入框 (仅 HM 可见) */}
                {user?.role === 'HM' && (
                    <Form.Item
                        name="interviewerNameOverride"
                        label="Interviewer Name (optional)"
                        help="If you are submitting feedback on behalf of someone else, enter their name here."
                    >
                        <Input placeholder="Enter the name of the actual interviewer" />
                    </Form.Item>
                )}

                <Form.Item
                    name="evaluationText"
                    label={<Title level={5}>Evaluation</Title>}
                    rules={[{ required: true, message: 'Please provide your evaluation.' }]}
                >
                    <Input.TextArea rows={6} placeholder="Enter your detailed evaluation..." />
                </Form.Item>
                <Form.Item
                    name="recommendation"
                    label={<Title level={5}>Recommendation</Title>}
                    rules={[{ required: true, message: 'Please select a recommendation.' }]}
                >
                    <Radio.Group>
                        <Radio.Button value="PASS">Pass</Radio.Button>
                        <Radio.Button value="FAIL">Fail</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FeedbackModal;