import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, message as antdMessage, Spin } from "antd";
import { CopyOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export type Message = {
    role: "user" | "assistant";
    content: string;
    timestamp?: string; // Добавленное поле для отображения времени
};

type ChatWindowProps = {
    messages: Message[];
    themeMode: "light" | "dark";
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, themeMode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDark = themeMode === "dark";

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            antdMessage.success("Скопировано!", 1.2);
        }).catch(() => {
            antdMessage.error("Ошибка при копировании");
        });
    };

    return (
        <div
            ref={containerRef}
            style={{
                padding: 24,
                overflowY: "auto",
                height: "calc(100vh - 200px)",
                background: isDark ? "#1a1a1a" : "#ffffff",
                transition: "background 0.3s",
            }}
        >
            {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isLast = i === messages.length - 1;
                const timestamp = msg.timestamp || dayjs().format("HH:mm");

                return (
                    <div
                        key={i}
                        style={{
                            marginBottom: 20,
                            display: "flex",
                            justifyContent: isUser ? "flex-end" : "flex-start",
                            animation: "fadeIn 0.4s ease forwards",
                            opacity: 0,
                        }}
                    >
                        {!isUser && (
                            <Avatar
                                size="small"
                                icon={<RobotOutlined />}
                                style={{ marginRight: 8, backgroundColor: "#d9d9d9" }}
                            />
                        )}
                        <div
                            style={{
                                position: "relative",
                                maxWidth: "80%",
                                padding: "10px 16px",
                                borderRadius: 16,
                                fontSize: 15,
                                lineHeight: 1.5,
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                                backgroundColor: isUser
                                    ? isDark ? "#0050b3" : "#e6f7ff"
                                    : isDark ? "#2a2a2a" : "#f5f5f5",
                                color: isUser
                                    ? isDark ? "#ffffff" : "#0050b3"
                                    : isDark ? "#f0f0f0" : "#000000",
                                boxShadow: isDark
                                    ? "0 1px 4px rgba(0,0,0,0.4)"
                                    : "0 1px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            {msg.role === "assistant" && (
                                <button
                                    onClick={() => handleCopy(msg.content)}
                                    title="Скопировать"
                                    style={{
                                        position: "absolute",
                                        top: 6,
                                        right: 6,
                                        background: "transparent",
                                        border: "none",
                                        color: isDark ? "#ccc" : "#666",
                                        cursor: "pointer",
                                        fontSize: 14,
                                    }}
                                >
                                    <CopyOutlined />
                                </button>
                            )}

                            {msg.role === "assistant" && msg.content.trim() === "" && isLast ? (
                                <Spin size="small" />
                            ) : msg.role === "assistant" ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ children }) {
                                            return (
                                                <code
                                                    style={{
                                                        background: isDark ? "#333" : "#eee",
                                                        padding: "2px 4px",
                                                        borderRadius: 4,
                                                        fontSize: "0.9em",
                                                    }}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        pre({ children }) {
                                            return (
                                                <pre
                                                    style={{
                                                        background: isDark ? "#222" : "#f6f6f6",
                                                        padding: "12px",
                                                        borderRadius: 8,
                                                        overflowX: "auto",
                                                    }}
                                                >
                          {children}
                        </pre>
                                            );
                                        },
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                            <div
                                style={{
                                    fontSize: 11,
                                    color: isDark ? "#888" : "#999",
                                    marginTop: 6,
                                    textAlign: "right",
                                }}
                            >
                                {timestamp}
                            </div>
                        </div>
                        {isUser && (
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                style={{ marginLeft: 8, backgroundColor: "#1677ff" }}
                            />
                        )}
                    </div>
                );
            })}

            <style>
                {`
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        `}
            </style>
        </div>
    );
};

export default ChatWindow;
