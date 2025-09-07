// src/features/talentPool/ReactivateModal.js
import React from 'react';
import { Modal, Form, Select } from 'antd';

const { Option } = Select;

const ReactivateModal = ({ open, onReactivate, onCancel, activeDemands, loading }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title="Reactivate Candidate"
            okText="Reactivate"
            cancelText="Cancel"
            destroyOnClose
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => {
                    onReactivate(values.targetDemandId);
                }).catch(info => { console.log('Validate Failed:', info); });
            }}
        >
            <Form form={form} layout="vertical" name="reactivate_form">
                <Form.Item name="targetDemandId" label="Select an Active Demand to move this candidate to" rules={[{ required: true, message: 'Please select a demand!' }]}>
                    <Select placeholder="Select an active demand" loading={loading}>
                        {activeDemands.map(demand => (
                            <Option key={demand.id} value={demand.id}>{demand.jobTitle}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default ReactivateModal;