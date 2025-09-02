// src/features/candidates/CandidateHistoryDrawer.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Timeline, Spin, Alert, Empty, Button } from 'antd';
import { fetchCandidateHistory, clearHistory } from './candidateHistorySlice';

const CandidateHistoryDrawer = ({ open, onClose, candidate }) => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.candidateHistory);

    useEffect(() => {
        // 当抽屉打开且有候选人信息时，获取历史记录
        if (open && candidate?.id) {
            dispatch(fetchCandidateHistory({ 
                candidateId: candidate.id, 
                params: { page: 0, size: 20, sort: 'createdAt,desc' } 
            }));
        }

        // 当抽屉关闭时，清理历史记录状态
        return () => {
            if (open) { // This check ensures clearHistory is called when unmounting while open
                dispatch(clearHistory());
            }
        };
    }, [open, candidate, dispatch]);

    const loadMore = () => {
        // Placeholder for future pagination/infinite scroll
    };

    return (
        <Drawer
            title={`History for ${candidate?.name}`}
            placement="right"
            width={500}
            onClose={onClose}
            open={open}
        >
            {status === 'loading' && <Spin />}
            {status === 'failed' && <Alert message={`Error: ${error}`} type="error" />}
            {status === 'succeeded' && (
                <>
                    {items.length === 0 ? (
                        <Empty description="No history records found." />
                    ) : (
                        <Timeline>
                            {items.map(item => (
                                <Timeline.Item key={item.id}>
                                    <p><strong>{item.actionType}</strong> by {item.createdByName}</p>
                                    <p>{item.details}</p>
                                    <p style={{ fontSize: '12px', color: '#888' }}>
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    )}
                    {/* Placeholder for "Load More" button if pagination is needed */}
                    {/* <Button onClick={loadMore}>Load More</Button> */}
                </>
            )}
        </Drawer>
    );
};

export default CandidateHistoryDrawer;