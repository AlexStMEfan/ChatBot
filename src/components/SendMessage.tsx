import React, { useState } from "react";
import { Input, Button, Tooltip, Space } from 'antd';
import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';


type SendMessageProps = {
    onSend: (text: string) => void;
};

const SendMessage: React.FC<SendMessageProps> = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        console.log("Отправка запроса:", message);
        onSend(message);
        setMessage("");
    };

    return (
        <div
            style={{
                padding: '16px',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
                    />
                </Tooltip>
            </Space>
        </div>
    );
};

export default SendMessage;
