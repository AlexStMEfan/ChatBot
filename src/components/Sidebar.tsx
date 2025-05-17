import React, { useState, useCallback } from 'react';
import {
    Layout,
    Button,
    Avatar,
    Modal,
    Input,
    Menu,
    message,
} from 'antd';
import {
    PlusOutlined,
    UserOutlined,
    EditOutlined,
    DownloadOutlined,
    InboxOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ChatSearch from './ChatSearch';
import SidebarItem from './SidebarItem';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveAs } from 'file-saver';
import './Sidebar.css';

const { Sider } = Layout;

export interface ChatType {
    id: number;
    name: string;
}

interface SidebarProps {
    collapsed: boolean;
    themeMode: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, themeMode }) => {
    const [chats, setChats] = useState<ChatType[]>([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [chatToRename, setChatToRename] = useState<ChatType | null>(null);
    const [newChatName, setNewChatName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const isDark = themeMode === 'dark';

    const generateUniqueId = () => Date.now();

    const handleCreateChat = () => {
        const newChat: ChatType = {
            id: generateUniqueId(),
            name: `Новый чат ${chats.length + 1}`,
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChat(newChat.id);
        navigate(`/chat/${newChat.id}`);
    };

    const exportChatToMarkdown = (chat: ChatType) => {
        const markdown = `# Чат: ${chat.name}\n\n*Это пример содержимого чата.*`;
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, `${chat.name}.md`);
    };

    const moveChat = useCallback((dragIndex: number, hoverIndex: number) => {
        const draggedChat = chats[dragIndex];
        setChats(
            update(chats, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, draggedChat],
                ],
            })
        );
    }, [chats]);

    const handleMenuClick = (key: string, chat: ChatType) => {
        switch (key) {
            case 'delete':
                Modal.confirm({
                    title: `Удалить чат "${chat.name}"?`,
                    content: 'Это действие нельзя отменить. Вы уверены?',
                    okText: 'Удалить',
                    okType: 'danger',
                    cancelText: 'Отмена',
                    onOk() {
                        setChats(prev => prev.filter(c => c.id !== chat.id));
                        if (activeChat === chat.id) setActiveChat(null);
                        message.success(`Чат "${chat.name}" удалён`);
                    },
                });
                break;
            case 'rename':
                setChatToRename(chat);
                setNewChatName(chat.name);
                setRenameModalVisible(true);
                break;
            case 'export':
                exportChatToMarkdown(chat);
                break;
            case 'archive':
                message.info(`Архивировать чат: ${chat.name}`);
                break;
        }
    };

    const renderDropdownMenu = (chat: ChatType) => (
        <Menu
            onClick={({ key }) => handleMenuClick(key, chat)}
            items={[
                { key: 'rename', icon: <EditOutlined />, label: 'Переименовать' },
                { key: 'export', icon: <DownloadOutlined />, label: 'Экспортировать' },
                { key: 'archive', icon: <InboxOutlined />, label: 'Архивировать' },
                { type: 'divider' },
                { key: 'delete', icon: <DeleteOutlined />, label: 'Удалить', danger: true },
            ]}
        />
    );

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <Sider
                width={300}
                collapsedWidth={0}
                collapsed={collapsed}
                trigger={null}
                className={`custom-sidebar ${isDark ? 'dark' : 'light'}`}
            >
                <div className="sidebar-container">
                    {!collapsed && <div className="sidebar-header">ChatBot</div>}

                    <div className="sidebar-button">
                        <Button
                            type="primary"
                            block
                            icon={<PlusOutlined />}
                            onClick={handleCreateChat}
                            style={{
                                background: isDark ? '#444' : undefined,
                                borderColor: isDark ? '#666' : undefined,
                            }}
                        >
                            Новый чат
                        </Button>
                    </div>

                    <ChatSearch
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        themeMode={themeMode}
                    />

                    <div className="sidebar-chat-list">
                        {filteredChats.length === 0 ? (
                            <div className="sidebar-empty">Чаты не найдены</div>
                        ) : (
                            filteredChats.map((chat, index) => (
                                <SidebarItem
                                    key={chat.id}
                                    id={chat.id}
                                    index={index}
                                    name={chat.name}
                                    isActive={chat.id === activeChat}
                                    collapsed={collapsed}
                                    themeMode={themeMode}
                                    moveChat={moveChat}
                                    onClick={() => {
                                        setActiveChat(chat.id);
                                        navigate(`/chat/${chat.id}`);
                                    }}
                                    dropdown={renderDropdownMenu(chat)}
                                />
                            ))
                        )}
                    </div>

                    {!collapsed && (
                        <div className="sidebar-user" onClick={() => setIsModalVisible(true)}>
                            <div className="avatar-wrapper">
                                <Avatar size="large" icon={<UserOutlined />} />
                                <div className="status-indicator" />
                            </div>
                            <div className="user-info">
                                <div className="user-name">Александр Иванов</div>
                                <div className="user-email">alexander@email.com</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Модальные окна */}
                <Modal
                    title="Информация о пользователе"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    className={isDark ? 'dark-modal' : ''}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                        <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>
                                Александр Иванов
                            </div>
                            <div style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
                                Руководитель проектов
                            </div>
                            <div style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
                                alexander@email.com
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button block>Импортировать чаты</Button>
                        <Button type="primary" block onClick={() => setIsModalVisible(false)}>
                            Закрыть
                        </Button>
                    </div>
                </Modal>

                <Modal
                    title="Переименовать чат"
                    open={renameModalVisible}
                    onCancel={() => setRenameModalVisible(false)}
                    onOk={() => {
                        if (!newChatName.trim()) {
                            message.error('Название чата не может быть пустым');
                            return;
                        }
                        if (chatToRename) {
                            setChats((prev) =>
                                prev.map((c) =>
                                    c.id === chatToRename.id ? { ...c, name: newChatName } : c
                                )
                            );
                        }
                        setRenameModalVisible(false);
                    }}
                    okText="Сохранить"
                    cancelText="Отмена"
                    className={isDark ? 'dark-modal' : ''}
                >
                    <Input
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        placeholder="Введите новое название чата"
                        maxLength={50}
                    />
                </Modal>
            </Sider>
        </DndProvider>
    );
};

export default Sidebar;
