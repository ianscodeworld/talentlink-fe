// src/features/users/CreateUserModal.js
import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const CreateUserModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    // 预设的技能选项，未来可以从 API 获取
    const specialtiesOptions = ["JAVA", "QA", "REACT", "FULLSTACK", "ANGULAR","BA","DEVOPS"];

    return (
        <Modal
            open={open}
            title="Create a New Interviewer"
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
            <Form form={form} layout="vertical" name="create_user_form">
                <Form.Item
                    name="name"
                    label="Username"
                    rules={[{ required: true, message: 'Please input the username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="specialties"
                    label="Specialties"
                    rules={[{ required: true, message: 'Please select at least one specialty!' }]}
                >
                    <Select mode="multiple" placeholder="Select specialties">
                        {specialtiesOptions.map(spec => <Option key={spec} value={spec}>{spec}</Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUserModal;