// src/features/squads/CreateSquadModal.js
import React from 'react';
import { Modal, Form, Input } from 'antd';

const CreateSquadModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title="Create a New Squad"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => {
                    form.resetFields();
                    onCreate(values);
                }).catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
        >
            <Form form={form} layout="vertical" name="create_squad_form">
                <Form.Item name="name" label="Squad Name" rules={[{ required: true, message: 'Please input the squad name!' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateSquadModal;