import React, { useMemo } from 'react';
import { Dropdown, MenuProps } from 'antd';
import {
    EditOutlined,
    DownloadOutlined,
    InboxOutlined,
    DeleteOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import './SidebarItem.css';

type MenuKey = 'rename' | 'export' | 'archive' | 'delete';

interface SidebarItemProps {
    id: string | number; // для масштабируемости
    name: string;
    isActive: boolean;
    collapsed: boolean;
    themeMode: 'light' | 'dark';
    onClick: () => void;
    onMenuClick: (key: MenuKey, id: string | number) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
                                                     id,
                                                     name,
                                                     isActive,
                                                     collapsed,
                                                     themeMode,
                                                     onClick,
                                                     onMenuClick,
                                                 }) => {
    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (
            key === 'rename' ||
            key === 'export' ||
            key === 'archive' ||
            key === 'delete'
        ) {
            onMenuClick(key, id);
        } else {
            console.warn(`Unknown menu key: ${key}`);
        }
    };

    // Мемоизация элементов меню, чтобы не создавать новый массив на каждый рендер
    const dropdownItems: MenuProps['items'] = useMemo(() => [
        { key: 'rename', icon: <EditOutlined />, label: 'Переименовать' },
        { key: 'export', icon: <DownloadOutlined />, label: 'Экспортировать' },
        { key: 'archive', icon: <InboxOutlined />, label: 'Архивировать' },
        { type: 'divider' },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Удалить', danger: true },
    ], []);

    return (
        <div
            className={classNames('sidebar-item', {
                active: isActive,
                dark: themeMode === 'dark',
            })}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="sidebar-item-content">
                <span className="chat-name">{collapsed ? name.charAt(0) : name}</span>

                {!collapsed && (
                    <Dropdown
                        trigger={['click']}
                        menu={{ items: dropdownItems, onClick: handleMenuClick }}
                        placement="bottomRight"
                    >
                        <div
                            className="options-button"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Настройки чата"
                            tabIndex={-1} // чтобы не было фокуса при табе
                        >
                            <MoreOutlined />
                        </div>
                    </Dropdown>
                )}
            </div>
        </div>
    );
};

export default SidebarItem;
