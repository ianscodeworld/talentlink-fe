// src/components/GlobalSearchBar.js
import React from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const GlobalSearchBar = () => {
    const navigate = useNavigate();

    const onSearch = (value) => {
        if (value) {
            navigate(`/search/results?q=${encodeURIComponent(value)}`);
        }
    };

    return (
        <Search
            placeholder="Search Candidates..."
            onSearch={onSearch}
            style={{ width: 250, verticalAlign: 'middle' }}
        />
    );
};

export default GlobalSearchBar;