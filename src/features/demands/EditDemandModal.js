// src/features/candidates/EditCandidateModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

const EditCandidateModal = ({ open, onUpdate, onCancel, initialData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue(initialData);
        }
    }, [open, initialData, form]);

    return (
        <Modal
            open={open}
            title={`Edit Candidate: ${initialData?.name}`}
            okText="Update"
            cancelText="Cancel"
            width={800}
            destroyOnClose
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => {
                    onUpdate(initialData.id, values);
                }).catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
        >
            <Form form={form} layout="vertical" name="edit_candidate_form">
                <Row gutter={16}><Col span={12}><Form.Item name="name" label="Resource Name" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="vendorName" label="Vendor Name" rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
                <Row gutter={16}><Col span={12}><Form.Item name="gender" label="Gender"><Input /></Form.Item></Col><Col span={12}><Form.Item name="seniority" label="Seniority"><Input /></Form.Item></Col></Row>
                <Form.Item name="skillset" label="Skillset"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                <Form.Item name="resumeSummary" label="Resume Summary"><Input.TextArea autoSize={{ minRows: 5 }} /></Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCandidateModal;