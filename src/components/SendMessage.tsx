import React, { useState } from "react";
import { Input, Button, Tooltip, Space } from 'antd';
import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';

type SendMessageProps = {
    onSend: (text: string, model: string, chatId: string) => void;
    onCreateChat: () => Promise<string>;
    activeChatId: string | null;
    themeMode: 'light' | 'dark';
    model: string;  // теперь модель приходит из пропсов
};

const MAX_MESSAGE_LENGTH = 4000;

const SendMessage: React.FC<SendMessageProps> = ({ onSend, onCreateChat, activeChatId, themeMode, model }) => {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return;

        let chatId = activeChatId;
        if (!chatId) {
            chatId = await onCreateChat();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.debug("Отправка запроса:", trimmed, "Модель:", model, "Чат:", chatId);
        }

        onSend(trimmed, model, chatId);
        setMessage("");
    };

    const isDark = themeMode === 'dark';

    return (
        <div
            style={{
                padding: '16px',
                border: isDark ? '1px solid #333' : '1px solid #f0f0f0',
                borderRadius: '30px',
                background: isDark ? '#1e1e1e' : '#fff',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Введите запрос к нейросети..."
                allowClear
                size="large"
                style={{
                    fontSize: 16,
                    border: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    color: isDark ? '#f5f5f5' : '#000',
                    outline: 'none',
                }}
            />

            <Space style={{ justifyContent: 'space-between' }}>

                    <Tooltip title="Загрузить файл">
                        <Button
                            icon={<CloudUploadOutlined />}
                            size="large"
                            shape="circle"
                        />
                    </Tooltip>
                    <Tooltip title="Отправить">
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            size="large"
                            shape="circle"
                            onClick={handleSend}
                            disabled={!message.trim() || message.length > MAX_MESSAGE_LENGTH}
                        />
                    </Tooltip>

            </Space>
        </div>
    );
};

export default SendMessage;
