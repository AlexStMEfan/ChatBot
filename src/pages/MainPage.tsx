import React, { useState, useCallback, useMemo } from 'react';
import {
    Layout, Select, Button, Space, ConfigProvider, theme as antdTheme, Dropdown, Tooltip, message,
} from 'antd';
import {
    MenuOutlined, MenuFoldOutlined, GlobalOutlined, SunOutlined, MoonOutlined,
} from '@ant-design/icons';

import Sidebar from '../components/Sidebar';
import ChatWindow, { Message } from '../components/ChatWindow';
import SendMessage from '../components/SendMessage';

const { Header, Content } = Layout;

export type Chat = {
    id: string;
    name: string;
    messages: Message[]; // теперь используем правильный тип Message
}

const MainPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const [model, setModel] = useState('chatgpt');

    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]); // актуальный тип

    const isDark = themeMode === 'dark';

    const handleCreateChat = useCallback(() => {
        const newChat: Chat = {
            id: crypto.randomUUID(),
            name: `Новый чат ${chats.length + 1}`,
            messages: [],
        };
        setChats(prev => [...prev, newChat]);
        setSelectedChatIndex(chats.length);
        setMessages([]);
    }, [chats.length]);

    const handleSelectChat = useCallback((id: string) => {
        const index = chats.findIndex(chat => chat.id === id);
        if (index !== -1) {
            setSelectedChatIndex(index);
            setMessages(chats[index].messages);
        }
    }, [chats]);

    const handleDeleteChat = useCallback((id: string) => {
        setChats(prev => {
            const newChats = prev.filter(chat => chat.id !== id);
            if (selectedChatIndex !== null) {
                const selectedChatId = prev[selectedChatIndex]?.id;
                if (selectedChatId === id) {
                    setSelectedChatIndex(null);
                    setMessages([]);
                } else {
                    const newIndex = newChats.findIndex(chat => chat.id === selectedChatId);
                    setSelectedChatIndex(newIndex !== -1 ? newIndex : null);
                }
            }
            return newChats;
        });
    }, [selectedChatIndex]);

    const handleRenameChat = useCallback((id: string, newName: string) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === id ? { ...chat, name: newName } : chat
            )
        );
    }, []);

    const handleSend = useCallback((text: string) => {
        if (!text.trim() || selectedChatIndex === null || !chats[selectedChatIndex]) return;

        const newMessage: Message = {
            role: 'user',
            content: text.trim(),
        };

        setMessages(prev => [...prev, newMessage]);
        setChats(prev => {
            const updated = [...prev];
            updated[selectedChatIndex].messages.push(newMessage);
            return updated;
        });

        // Пример ответа ассистента (заглушка)
        setTimeout(() => {
            const assistantMessage: Message = {
                role: 'assistant',
                content: 'Это пример ответа ассистента.',
            };
            setMessages(prev => [...prev, assistantMessage]);
            setChats(prev => {
                const updated = [...prev];
                updated[selectedChatIndex].messages.push(assistantMessage);
                return updated;
            });
        }, 1000);
    }, [selectedChatIndex, chats]);

    const languageMenu = useMemo(() => ({
        items: [
            { key: 'ru', label: 'Русский' },
            { key: 'en', label: 'English' },
        ],
        onClick: ({ key }: { key: string }) => {
            message.info(`Язык изменён на: ${key}`);
        },
    }), []);

    const activeChatId = selectedChatIndex !== null ? chats[selectedChatIndex]?.id : null;

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                    fontFamily: 'Inter, sans-serif',
                },
            }}
        >
            <Layout style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar
                    chats={chats}
                    selectedChatIndex={selectedChatIndex}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                    onRenameChat={handleRenameChat}
                    onCreateChat={handleCreateChat}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    themeMode={themeMode}
                    activeChatId={activeChatId}
                />
                <Layout style={{ marginLeft: collapsed ? 0 : 0, transition: 'margin-left 0.2s ease' }}>
                    <Header
                        style={{
                            padding: '0 24px',
                            background: isDark ? '#1f1f1f' : '#fff',
                            borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Space>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: 18,
                                    padding: '6px 8px',
                                    borderRadius: 40,
                                    background: isDark ? '#2c2c2c' : '#fff',
                                    color: isDark ? '#f0f0f0' : '#555',
                                    height: 40,
                                    minWidth: 40,
                                }}
                            />
                            <Select
                                value={model}
                                onChange={setModel}
                                style={{ width: 160, height: 40 }}
                                options={[
                                    { label: 'ChatGPT', value: 'chatgpt' },
                                    { label: 'YandexGPT', value: 'yandexgpt' },
                                    { label: 'Qwen', value: 'qwen' },
                                    { label: 'GigaChat', value: 'gigachat' },
                                ]}
                            />
                        </Space>
                        <Space>
                            <Dropdown menu={languageMenu}>
                                <Button
                                    icon={<GlobalOutlined />}
                                    style={{
                                        background: isDark ? '#2c2c2c' : '#fff',
                                        border: 'none',
                                        borderRadius: 40,
                                        height: 40,
                                        width: 40,
                                    }}
                                />
                            </Dropdown>
                            <Tooltip title={themeMode === 'dark' ? 'Тёмная тема' : 'Светлая тема'}>
                                <Button
                                    icon={themeMode === 'dark' ? <MoonOutlined /> : <SunOutlined />}
                                    onClick={() =>
                                        setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'))
                                    }
                                    style={{
                                        border: 'none',
                                        borderRadius: 40,
                                        background: isDark ? '#2c2c2c' : '#fff',
                                        height: 40,
                                        width: 40,
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    </Header>
                    <Content
                        style={{
                            height: 'calc(100vh - 64px)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <ChatWindow messages={messages} />
                        </div>
                        <div style={{ flexShrink: 0, padding: '16px 24px' }}>
                            <SendMessage
                                onSend={handleSend}
                                themeMode={themeMode}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default MainPage;
