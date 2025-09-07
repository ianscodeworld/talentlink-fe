// src/features/candidates/DuplicateCandidateModal.js
import React from 'react';
import { Modal, Button, Descriptions, Col, Row, Typography } from 'antd';

const { Title } = Typography;

const DuplicateCandidateModal = ({ open, onProceed, onCancel, newCandidateData, existingCandidate }) => {
    return (
        <Modal
            open={open}
            title="Duplicate Candidate Warning"
            width={900}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="proceed" type="primary" onClick={onProceed}>
                    Proceed to Add Anyway
                </Button>,
            ]}
        >
            <p>A candidate with a similar name already exists in the system. Please review the details before proceeding.</p>
            <Row gutter={16}>
                <Col span={12}>
                    <Title level={5}>New Candidate Data</Title>
                    <Descriptions bordered column={1} size="small">
                        {Object.entries(newCandidateData).map(([key, value]) => (
                            <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                </Col>
                <Col span={12}>
                    <Title level={5}>Existing Candidate Data</Title>
                     <Descriptions bordered column={1} size="small">
                        {Object.entries(existingCandidate).map(([key, value]) => (
                            <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                </Col>
            </Row>
        </Modal>
    );
};

export default DuplicateCandidateModal;