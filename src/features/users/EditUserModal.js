// src/features/users/EditUserModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Select, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const EditUserModal = ({ open, onUpdate, onCancel, initialUserData }) => {
    const [form] = Form.useForm();
    const specialtiesOptions = ["JAVA", "QA", "REACT", "FULLSTACK", "GO"];

    useEffect(() => {
        if (initialUserData) {
            form.setFieldsValue(initialUserData);
        }
    }, [initialUserData, form]);

    return (
        <Modal
            open={open}
            title={`Edit User: ${initialUserData?.name}`}
            okText="Update"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => {
                    // We only pass the changed values
                    onUpdate(initialUserData.id, values);
                }).catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
        >
            <Typography.Paragraph>
                <Text strong>Email: </Text><Text type="secondary">{initialUserData?.email}</Text>
            </Typography.Paragraph>
            <Form form={form} layout="vertical" name="edit_user_form">
                <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select a role!' }]}>
                    <Select placeholder="Select a role">
                        <Option value="HM">HM</Option>
                        <Option value="INTERVIEWER">INTERVIEWER</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="specialties" label="Specialties" rules={[{ required: true, message: 'Please select at least one specialty!' }]}>
                    <Select mode="multiple" placeholder="Select specialties">
                        {specialtiesOptions.map(spec => <Option key={spec} value={spec}>{spec}</Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;