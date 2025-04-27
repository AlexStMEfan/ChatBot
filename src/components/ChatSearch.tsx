import { Input, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ChatSearch = ({ chats, setActiveChat }: { chats: any[], setActiveChat: (id: number) => void }) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredChats, setFilteredChats] = useState<any[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.trim() !== '') {
            const filtered = chats.filter(chat =>
                chat.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredChats(filtered);
        } else {
            setFilteredChats([]);
        }
    };

    const handleSelectChat = (chatId: number) => {
        setActiveChat(chatId);
        setSearchValue('');
        setFilteredChats([]);
    };

    const menu = (
        <Menu>
            {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                    <Menu.Item key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                        {chat.name}
                    </Menu.Item>
                ))
            ) : (
                <Menu.Item disabled>Ничего не найдено</Menu.Item>
            )}
        </Menu>
    );

    return (
        <div style={{ padding: '16px' }}>
            <Dropdown
                overlay={menu}
                visible={searchValue.length > 0}
                placement="bottomLeft"
                trigger={['click']}
            >
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Поиск чатов..."
                    value={searchValue}
                    onChange={handleSearch}
                    style={{
                        borderRadius: 12,
                        padding: '6px 6px',
                        backgroundColor: '#f5f5f5',
                        border: 'none',
                        fontSize: 14,
                        color: '#595959',
                    }}
                />
            </Dropdown>
        </div>
    );
};

export default ChatSearch;
