// src/pages/TalentPoolPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Alert, Typography, message, Input, Space, Tag } from 'antd';
import { fetchTalentPool, reactivateCandidate } from '../features/talentPool/talentPoolSlice';
import { fetchDemands } from '../features/demands/demandSlice';
import ReactivateModal from '../features/talentPool/ReactivateModal';
import { useDebounce } from 'use-debounce';

const { Title, Paragraph } = Typography;

const TalentPoolPage = () => {
    const dispatch = useDispatch();
    const [nameFilter, setNameFilter] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [reactivatingCandidate, setReactivatingCandidate] = useState(null);
    
    const [debouncedName] = useDebounce(nameFilter, 500);
    const [debouncedSpecialty] = useDebounce(specialtyFilter, 500);

    const { candidates, status, error, pagination } = useSelector((state) => state.talentPool);
    const { items: activeDemands, status: demandsStatus } = useSelector((state) => state.demands);

    useEffect(() => {
        dispatch(fetchTalentPool({ page: 0, size: 10, name: debouncedName, specialty: debouncedSpecialty }));
    }, [dispatch, debouncedName, debouncedSpecialty]);

    useEffect(() => {
        if (demandsStatus === 'idle') {
            dispatch(fetchDemands({ page: 0, size: 100, status: 'ACTIVE' }));
        }
    }, [dispatch, demandsStatus]);

    const handleReactivate = async (targetDemandId) => {
        try {
            await dispatch(reactivateCandidate({ candidateId: reactivatingCandidate.id, targetDemandId })).unwrap();
            message.success(`${reactivatingCandidate.name} reactivated successfully!`);
            setReactivatingCandidate(null);
        } catch (err) {
            message.error(`Failed to reactivate candidate: ${err}`);
        }
    };

    const handleTableChange = (p) => { dispatch(fetchTalentPool({ page: p.current - 1, size: p.pageSize, name: debouncedName, specialty: debouncedSpecialty })); };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Vendor', dataIndex: 'vendorName', key: 'vendorName' },
        { title: 'Skillset', dataIndex: 'skillset', key: 'skillset', render: (text) => text && text.split(',').map(s => <Tag key={s}>{s.trim()}</Tag>) },
        { title: 'Action', key: 'action', render: (_, record) => (
            <Button type="primary" onClick={() => setReactivatingCandidate(record)}>Reactivate</Button>
        )},
    ];

    return (
        <div>
            <Title level={2}>Talent Pool</Title>
            <Paragraph type="secondary">Search and reactivate candidates who are currently "On Hold".</Paragraph>
            <Space style={{ marginBottom: 16 }}>
                <Input placeholder="Search by Name" onChange={e => setNameFilter(e.target.value)} allowClear />
                <Input placeholder="Search by Specialty" onChange={e => setSpecialtyFilter(e.target.value)} allowClear />
            </Space>

            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table
                columns={columns}
                dataSource={candidates}
                rowKey="id"
                loading={status === 'loading'}
                onChange={handleTableChange}
                pagination={{ current: pagination.currentPage + 1, pageSize: pagination.size, total: pagination.totalElements }}
            />

            <ReactivateModal
                open={!!reactivatingCandidate}
                onReactivate={handleReactivate}
                onCancel={() => setReactivatingCandidate(null)}
                activeDemands={activeDemands}
                loading={demandsStatus !== 'succeeded'}
            />
        </div>
    );
};
export default TalentPoolPage;