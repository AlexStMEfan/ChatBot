import React from 'react';
import { MenuOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Button, Tooltip } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import './SidebarItem.css';

export interface SidebarItemProps {
    id: number;
    index: number;
    name: string;
    isActive: boolean;
    collapsed: boolean;
    themeMode: 'light' | 'dark';
    moveChat: (dragIndex: number, hoverIndex: number) => void;
    onClick: () => void;
    dropdown: React.ReactElement;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
                                                     id,
                                                     index,
                                                     name,
                                                     isActive,
                                                     collapsed,
                                                     themeMode,
                                                     moveChat,
                                                     onClick,
                                                     dropdown,
                                                 }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: 'chat',
        hover(item: { id: number; index: number }) {
            if (!ref.current || item.index === index) return;
            moveChat(item.index, index);
            item.index = index;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'chat',
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const isDark = themeMode === 'dark';

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={`sidebar-item ${isActive ? 'active' : ''} ${isDark ? 'dark' : 'light'}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: isActive ? (isDark ? '#2a2a2a' : '#e6f7ff') : 'transparent',
                color: isDark ? '#fff' : '#000',
            }}
        >
            <div className="sidebar-item-content">
                <MenuOutlined style={{ marginRight: 8, fontSize: 16, color: isDark ? '#bbb' : '#888' }} />
                <span className="chat-name">{name}</span>
            </div>
            {!collapsed && (
                <Dropdown overlay={dropdown} trigger={['click']}>
                    <Tooltip title="Опции">
                        <Button
                            shape="circle"
                            icon={<MoreOutlined />}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                border: 'none',
                                background: isDark ? '#3a3a3a' : 'transparent',
                                color: isDark ? '#bbb' : '#555',
                            }}
                        />
                    </Tooltip>
                </Dropdown>
            )}
        </div>
    );
};

export default SidebarItem;
