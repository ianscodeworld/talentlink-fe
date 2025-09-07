// src/pages/SearchResultsPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Table, Spin, Alert, Typography, Tag } from 'antd';
import { searchCandidates } from '../features/search/searchSlice';

// --- THIS IS THE FIX ---
// Added 'Text' to the Typography destructuring
const { Title, Paragraph, Text } = Typography;
// --- END FIX ---

const SearchResultsPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { results, status, error, pagination } = useSelector((state) => state.search);

    useEffect(() => {
        if (query) {
            dispatch(searchCandidates({ q: query, page: 0, size: 10 }));
        }
    }, [query, dispatch]);

    const handleTableChange = (p) => {
        if (query) {
            dispatch(searchCandidates({ q: query, page: p.current - 1, size: p.pageSize }));
        }
    };
    
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag>{s}</Tag> },
        { title: 'Vendor', dataIndex: 'vendorName', key: 'vendorName' },
        { title: 'Skillset', dataIndex: 'skillset', key: 'skillset' },
        { 
            title: 'Action', 
            key: 'action', 
            render: (_, record) => (
                <Link to={`/hm/demands/${record.demandId}`}>View in Demand</Link>
            )
        },
    ];

    return (
        <div>
            <Title level={2}>Search Results</Title>
            {query ? (
                <Paragraph>Showing results for: <Text strong>"{query}"</Text></Paragraph>
            ) : (
                <Paragraph>Please enter a search term.</Paragraph>
            )}

            {error && <Alert message={`Error: ${error}`} type="error" style={{ marginBottom: 16 }} />}
            <Table
                columns={columns}
                dataSource={results}
                rowKey="id"
                loading={status === 'loading'}
                onChange={handleTableChange}
                pagination={{
                    current: pagination.currentPage + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements,
                }}
            />
        </div>
    );
};

export default SearchResultsPage;