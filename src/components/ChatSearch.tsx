import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface ChatSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    themeMode: 'light' | 'dark';
}

const ChatSearch: React.FC<ChatSearchProps> = ({ searchTerm, setSearchTerm, themeMode }) => {
    const isDark = themeMode === 'dark';

    return (
        <div style={{ padding: '0 16px 16px 16px' }}>
            <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Поиск чатов"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    backgroundColor: isDark ? '#141414' : undefined,
                    color: isDark ? '#fff' : undefined,
                }}
            />
        </div>
    );
};

export default ChatSearch;
