// src/features/candidates/GenerateEmailModal.js
import React from 'react';
import { Modal, Spin, Alert, Input, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const GenerateEmailModal = ({ open, onClose, candidateName }) => {
    const { content, status, error } = useSelector((state) => state.emailSummary);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        message.success('Email content copied to clipboard!');
    };

    return (
        <Modal
            open={open}
            title={`Feedback Summary for ${candidateName}`}
            onCancel={onClose}
            width={700}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button key="copy" type="primary" icon={<CopyOutlined />} onClick={handleCopy} disabled={!content}>
                    Copy to Clipboard
                </Button>,
            ]}
        >
            {status === 'loading' && <Spin />}
            {status === 'failed' && <Alert message={`Error: ${error}`} type="error" />}
            {status === 'succeeded' && (
                <Input.TextArea
                    value={content}
                    readOnly
                    autoSize={{ minRows: 15, maxRows: 25 }}
                    style={{ background: '#fff', cursor: 'text' }}
                />
            )}
        </Modal>
    );
};

export default GenerateEmailModal;