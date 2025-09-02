// src/features/demands/CreateDemandModal.js
import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

const CreateDemandModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const specialtiesOptions = ["JAVA", "QA", "REACT", "FULLSTACK", "GO"]; // 预设技能

    return (
        <Modal
            open={open}
            title="Create a New Demand"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true, message: 'Please input the job title!' }]}>
                    <Input />
                </Form.Item>
                {/* 新增 Specialties 字段 */}
                <Form.Item name="specialties" label="Specialties">
                    <Select mode="multiple" placeholder="Select required specialties">
                        {specialtiesOptions.map(spec => <Option key={spec} value={spec}>{spec}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="totalInterviewRounds" label="Total Interview Rounds" rules={[{ required: true, message: 'Please input the number of rounds!' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateDemandModal;