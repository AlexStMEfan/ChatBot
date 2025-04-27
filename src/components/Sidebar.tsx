import React, { useState, useMemo, useRef } from 'react';
import {
    Layout,
    Menu,
    Button,
    Modal,
    Input,
    message,
    Dropdown,
    theme,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import ChatSearch from './ChatSearch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Sider } = Layout;

interface Chat {
    name: string;
    messages: string[];
}

interface SidebarProps {
    chats: Chat[];
    selectedChatIndex: number | null;
    onSelectChat: (index: number) => void;
    onDeleteChat: (index: number) => void;
    onRenameChat: (index: number, newName: string) => void;
    onCreateChat: (name: string) => void;
    onReorderChats: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
    index: number;
    type: 'chat';
}

const Sidebar: React.FC<SidebarProps> = ({
                                             chats,
                                             selectedChatIndex,
                                             onSelectChat,
                                             onDeleteChat,
                                             onRenameChat,
                                             onCreateChat,
                                             onReorderChats,
                                         }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [newChatInputValue, setNewChatInputValue] = useState('');
    const [renameInputValue, setRenameInputValue] = useState('');
    const [renameIndex, setRenameIndex] = useState<number | null>(null);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const navigate = useNavigate();
    const { token } = theme.useToken();

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const handleCreateChat = () => {
        const trimmed = newChatInputValue.trim();
        if (trimmed) {
            if (chats.some(chat => chat.name === trimmed)) {
                message.warning('Чат с таким названием уже существует');
                return;
            }
            onCreateChat(trimmed);
            setNewChatInputValue('');
            setIsCreateModalVisible(false);
        }
    };

    const handleRename = () => {
        if (renameIndex !== null && renameInputValue.trim()) {
            onRenameChat(renameIndex, renameInputValue.trim());
            setRenameInputValue('');
            setRenameIndex(null);
            setIsRenameModalVisible(false);
        }
    };

    const sortedChats = useMemo(() => {
        return [...chats].sort((a, b) => {
            const aTime = a.messages?.length ? a.messages[a.messages.length - 1] : '';
            const bTime = b.messages?.length ? b.messages[b.messages.length - 1] : '';
            return bTime.localeCompare(aTime);
        });
    }, [chats]);

    const renderDraggableItem = (chat: Chat, index: number) => {
        const ref = useRef<HTMLDivElement>(null);

        const [, drop] = useDrop<DragItem>({
            accept: 'chat',
            hover: (item) => {
                if (item.index !== index) {
                    onReorderChats(item.index, index);
                    item.index = index;
                }
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: 'chat',
            item: { index, type: 'chat' },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        drag(drop(ref));

        return (
            <div
                key={chat.name}
                ref={ref}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    padding: '4px 12px',
                    cursor: 'move',
                    backgroundColor:
                        selectedChatIndex === index
                            ? token.colorPrimaryBg
                            : 'transparent',
                    borderRadius: 4,
                    marginBottom: 4,
                }}
            >
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setRenameIndex(index);
                                    setRenameInputValue(chat.name);
                                    setIsRenameModalVisible(true);
                                }}
                            >
                                Переименовать
                            </Menu.Item>
                            <Menu.Item
                                icon={<DeleteOutlined />}
                                onClick={() => onDeleteChat(index)}
                            >
                                Удалить
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['contextMenu']}
                >
                    <div
                        onClick={() => onSelectChat(index)}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {chat.name}
                    </div>
                </Dropdown>
            </div>
        );
    };

    return (
        <>
            <Sider
                collapsible
                collapsed={isCollapsed}
                onCollapse={toggleCollapse}
                width={250}
                style={{
                    background: token.colorBgBase,
                    padding: '12px 8px',
                    overflowY: 'auto',
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <ChatSearch onSearch={() => {}} />
                </div>
                {sortedChats.map((chat, index) => renderDraggableItem(chat, index))}

                <div style={{ marginTop: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                        block
                    >
                        {!isCollapsed && 'Создать чат'}
                    </Button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    icon={<UserOutlined />}
                                    onClick={() => setIsUserModalVisible(true)}
                                >
                                    Профиль
                                </Menu.Item>
                                <Menu.Item
                                    icon={<LogoutOutlined />}
                                    onClick={() => navigate('/logout')}
                                >
                                    Выйти
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button icon={<MenuOutlined />} block>
                            {!isCollapsed && 'Меню'}
                        </Button>
                    </Dropdown>
                </div>
            </Sider>

            <Modal
                title="Новый чат"
                open={isCreateModalVisible}
                onOk={handleCreateChat}
                onCancel={() => setIsCreateModalVisible(false)}
                okText="Создать"
                cancelText="Отмена"
            >
                <Input
                    value={newChatInputValue}
                    onChange={e => setNewChatInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateChat()}
                    autoFocus
                    placeholder="Введите название чата"
                />
            </Modal>

            <Modal
                title="Переименовать чат"
                open={isRenameModalVisible}
                onOk={handleRename}
                onCancel={() => setIsRenameModalVisible(false)}
                okText="Переименовать"
                cancelText="Отмена"
            >
                <Input
                    value={renameInputValue}
                    onChange={e => setRenameInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRename()}
                    autoFocus
                    placeholder="Новое название чата"
                />
            </Modal>

            <Modal
                title="Профиль пользователя"
                open={isUserModalVisible}
                onCancel={() => setIsUserModalVisible(false)}
                footer={null}
            >
                <p>Здесь будет информация о пользователе.</p>
            </Modal>
        </>
    );
};

export default Sidebar;
