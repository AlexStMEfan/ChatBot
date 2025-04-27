import React, { useEffect, useRef } from 'react';
import { Card, Typography, Button, Tooltip, message as antdMessage, Avatar } from 'antd';
import { CopyOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Заменили на atomDark

const { Paragraph } = Typography;

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatWindowProps = {
    messages: Message[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            antdMessage.success('Скопировано!');
        } catch {
            antdMessage.error('Не удалось скопировать');
        }
    };

    const renderers = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>  {/* Заменили atomOneDark на atomDark */}
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: 4 }}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                overflowY: 'auto',
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
            }}
        >
            {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const backgroundColor = isUser ? '#1d8bf5' : '#fff';
                const textColor = isUser ? '#fff' : '#000';

                return (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: isUser ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-start',
                            gap: 8,
                        }}
                    >
                        {!isUser && <Avatar icon={<RobotOutlined />} />}
                        <Card
                            style={{
                                backgroundColor,
                                maxWidth: '80%',
                                color: textColor,
                                borderRadius: 12,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0',
                                position: 'relative',
                            }}
                            bodyStyle={{ padding: '5px 16px' }}
                        >
                            <Paragraph style={{ margin: 0, fontSize: 15, color: textColor }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
                                    {msg.content}
                                </ReactMarkdown>
                            </Paragraph>
                            {!isUser && (
                                <Tooltip title="Скопировать">
                                    <Button
                                        icon={<CopyOutlined />}
                                        size="small"
                                        type="text"
                                        onClick={() => handleCopy(msg.content)}
                                        style={{ position: 'absolute', top: 4, right: 4, color: '#999' }}
                                    />
                                </Tooltip>
                            )}
                        </Card>
                        {isUser && <Avatar icon={<UserOutlined />} />}
                    </div>
                );
            })}
        </div>
    );
};

export default ChatWindow;
