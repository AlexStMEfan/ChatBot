import React, { useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './ChatSearch.css';

interface ChatSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    themeMode: 'light' | 'dark';
}

const ChatSearch: React.FC<ChatSearchProps> = ({ searchTerm, setSearchTerm, themeMode }) => {

    const onInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {

            const value = e.target.value ?? '';
            setSearchTerm(value);
        },
        [setSearchTerm]
    );

    return (
        <div className={classNames('chat-search-container', { dark: themeMode === 'dark', light: themeMode === 'light' })}>
            <Input
                allowClear
                prefix={<SearchOutlined className="chat-search-icon" />}
                placeholder="Поиск чатов"
                value={searchTerm}
                onChange={onInputChange}
                className="chat-search-input"
            />
        </div>
    );
};

export default React.memo(ChatSearch);
