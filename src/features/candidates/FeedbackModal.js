// src/features/candidates/FeedbackModal.js
import React from 'react';
import { Modal, Form, Input, Radio, Typography } from 'antd';

const { Title } = Typography;

const FeedbackModal = ({ open, onFeedbackSubmit, onCancel, candidate }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            open={open}
            title={`Submit Feedback for ${candidate?.name}`}
            okText="Submit Feedback"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onFeedbackSubmit(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="feedback_form">
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