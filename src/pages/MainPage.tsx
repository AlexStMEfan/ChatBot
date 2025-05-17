import React, { useState } from 'react';
import {
    Layout,
    Select,
    Button,
    Space,
    ConfigProvider,
    theme as antdTheme,
    Dropdown,
    Tooltip,
    message,
} from 'antd';
import {
    MenuOutlined,
    MenuFoldOutlined,
    GlobalOutlined,
    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import SendMessage from '../components/SendMessage';

const { Header, Content } = Layout;

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type Chat = {
    name: string;
    messages: string[];
};

const MainPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [model, setModel] = useState<string>('chatgpt');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(null);

    const isDark = themeMode === 'dark';

    const handleSend = (text: string) => {
        if (!text.trim() || selectedChatIndex === null) return;

        const userMessage: Message = { role: 'user', content: text };
        const assistantMessage: Message = {
            role: 'assistant',
            content: `**Вы сказали:** ${text}`,
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);

        setChats(prev => {
            const updated = [...prev];
            updated[selectedChatIndex].messages.push(text, assistantMessage.content);
            return updated;
        });
    };

    const handleCreateChat = (name: string) => {
        const newChat: Chat = { name, messages: [] };
        setChats(prev => [...prev, newChat]);
        setSelectedChatIndex(chats.length);
        setMessages([]);
    };

    const handleRenameChat = (index: number, newName: string) => {
        setChats(prev => {
            const updated = [...prev];
            updated[index].name = newName;
            return updated;
        });
    };

    const handleDeleteChat = (index: number) => {
        setChats(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });

        if (selectedChatIndex === index) {
            setSelectedChatIndex(null);
            setMessages([]);
        } else if (selectedChatIndex !== null && selectedChatIndex > index) {
            setSelectedChatIndex(selectedChatIndex - 1);
        }
    };

    const handleReorderChats = (from: number, to: number) => {
        setChats(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated;
        });
    };

    const handleSelectChat = (index: number) => {
        setSelectedChatIndex(index);
        setMessages(
            chats[index]?.messages.map((m, i) => ({
                role: i % 2 === 0 ? 'user' : 'assistant',
                content: m,
            })) || []
        );
    };

    const languageMenu = {
        items: [
            { key: 'ru', label: 'Русский' },
            { key: 'en', label: 'English' },
        ],
        onClick: ({ key }: { key: string }) => {
            message.info(`Язык изменён на: ${key}`);
        },
    };

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
            <DndProvider backend={HTML5Backend}>
                <Layout style={{ height: '100vh', overflow: 'hidden' }}>
                    <Sidebar
                        chats={chats}
                        selectedChatIndex={selectedChatIndex}
                        onSelectChat={handleSelectChat}
                        onDeleteChat={handleDeleteChat}
                        onRenameChat={handleRenameChat}
                        onCreateChat={handleCreateChat}
                        onReorderChats={handleReorderChats}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        themeMode={themeMode}
                    />
                    <Layout style={{ marginLeft: collapsed ? 0 : 300, transition: 'margin-left 0.2s ease' }}>
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
                                <SendMessage onSend={handleSend} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </DndProvider>
        </ConfigProvider>
    );
};

export default MainPage;
