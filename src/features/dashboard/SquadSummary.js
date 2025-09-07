// src/features/dashboard/SquadSummary.js
import React from 'react';
import { Card, List, Progress, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const SquadSummary = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }
    return (
        <Card 
            title="Squads Progress Overview" 
            style={{ marginBottom: 24 }} 
            styles={{ header: {backgroundColor: '#fafafa'} }} // --- THIS IS THE FIX ---
        >
            <Row gutter={[16, 16]}>
                {data.map(item => (
                    <Col key={item.squadId} xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Card title={<Link to={`/admin/squads/${item.squadId}`}>{item.squadName}</Link>} size="small" style={{ width: '100%', height: '100%' }}>
                            <Progress percent={Math.round(item.progressPercentage * 100)} status="active" />
                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Positions:</Text><Text strong>{item.filledPositions} / {item.totalPositions}</Text></div>
                            <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Roles:</Text><Text strong>{item.roleBreakdown}</Text></div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default SquadSummary;