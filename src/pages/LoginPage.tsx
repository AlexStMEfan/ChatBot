import React, { useState } from 'react';
import { Button, Card, Divider, Input, Typography, Space, message } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = () => {
        if (!email || !password) {
            message.warning('Введите email и пароль');
            return;
        }
        setLoading(true);
        // TODO: Добавить вызов API для логина через email/password

        setTimeout(() => {
            setLoading(false);
            // Просто навигация на /app для демонстрации
            message.success('Вход успешен');
            navigate('/app');
        }, 1000);
    };

    const handleYandexLogin = () => {
        const clientId = process.env.REACT_APP_YANDEX_CLIENT_ID || 'ВАШ_CLIENT_ID';
        const redirectUri = encodeURIComponent(process.env.REACT_APP_YANDEX_REDIRECT_URI || 'https://ваш-домен.ру/auth/callback');
        const responseType = 'token';
        const scope = encodeURIComponent('login:email login:info');
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = authUrl;
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                overflow: 'auto',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                    margin: 'auto',
                }}
                styles={{ body: { padding: 32 } }}
            >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                    <Title level={3}>Вход в аккаунт</Title>
                    <Text type="secondary">Выберите способ входа</Text>
                </div>

                {/* Кнопка Яндекс 360 */}
                <Button
                    type="primary"
                    block
                    style={{ backgroundColor: '#FFCC00', borderColor: '#FFCC00', color: '#000' }}
                    onClick={handleYandexLogin}
                >
                    Войти через Яндекс 360
                </Button>

                {/* SSO вход */}
                <Button
                    block
                    style={{ backgroundColor: '#2e2e2e', borderColor: '#2e2e2e', color: '#fff' }}
                    onClick={() => navigate('/auth/sso')}
                >
                    Войти через SSO
                </Button>

                <Divider>или</Divider>

                {/* Email и пароль */}
                <Input
                    size="large"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                />
                <Input.Password
                    size="large"
                    placeholder="Пароль"
                    prefix={<LockOutlined />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
                <Button
                    type="primary"
                    block
                    icon={<LoginOutlined />}
                    loading={loading}
                    style={{ backgroundColor: '#1677ff', borderColor: '#1677ff' }}
                    onClick={handleEmailLogin}
                >
                    Войти
                </Button>

                <Space direction="horizontal" style={{ justifyContent: 'center', width: '100%' }}>
                    <Button type="link" onClick={() => navigate('/reset')}>
                        Забыли пароль?
                    </Button>
                    <Button type="link" onClick={() => navigate('/reg')}>
                        Регистрация
                    </Button>
                </Space>
            </Space>
            </Card>
        </div>
    );
};

export default LoginPage;