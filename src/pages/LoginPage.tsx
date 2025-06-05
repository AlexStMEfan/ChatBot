import React, { useEffect } from 'react';
import { Button, Card, Divider, Input, Typography, Space } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';

declare global {
    interface Window {
        VKID: any;
        VKIDSDK: any;
    }
}
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@2.16.0/dist-sdk/umd/index.js';
        script.async = true;
        script.onload = () => {
            if ('VKIDSDK' in window) {
                const VKID = (window as any).VKIDSDK;

                VKID.Config.init({
                    app: Number(process.env.REACT_APP_VKID_CLIENT_ID || '53704418'),
                    redirectUrl: 'https://alex-labs.ru',
                    responseMode: VKID.ConfigResponseMode.Callback,
                    source: VKID.ConfigSource.LOWCODE,
                    scope: '',
                });

                const oneTap = new VKID.OneTap();

                oneTap
                    .render({
                        container: document.getElementById('vkid-widget'),
                        showAlternativeLogin: true,
                    })
                    .on(VKID.WidgetEvents.ERROR, (error: any) => {
                        console.error('VK ID Error:', error);
                    })
                    .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload: any) {
                        const code = payload.code;
                        const deviceId = payload.device_id;

                        VKID.Auth.exchangeCode(code, deviceId)
                            .then((result: any) => {
                                console.log('VK ID Success:', result);
                                window.location.href = '/app';
                            })
                            .catch((error: any) => {
                                console.error('VK ID Auth Error:', error);
                            });
                    });
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
            }}
        >
            <Card
                style={{
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                }}
                bodyStyle={{ padding: 32 }}
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
                        onClick={() => {
                            const clientId = 'ВАШ_CLIENT_ID';
                            const redirectUri = encodeURIComponent('https://ваш-домен.ру/auth/callback');
                            const responseType = 'token';
                            const scope = encodeURIComponent('login:email login:info');
                            const authUrl = `https://oauth.yandex.ru/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
                            window.open(authUrl, '_self');
                        }}
                    >
                        Войти через Яндекс 360
                    </Button>

                    {/* Контейнер для VK ID кнопки */}
                    <div id="vkid-widget" style={{ minHeight: 80 }} />

                    {/* SSO вход */}
                    <Button
                        block
                        style={{ backgroundColor: '#2e2e2e', borderColor: '#2e2e2e', color: '#fff' }}
                        onClick={() => window.location.href = '/auth/sso'}
                    >
                        Войти через SSO
                    </Button>

                    <Divider>или</Divider>

                    {/* Email и пароль */}
                    <Input size="large" placeholder="Email" prefix={<MailOutlined />} type="email" />
                    <Input.Password size="large" placeholder="Пароль" prefix={<LockOutlined />} />
                    <Button
                        type="primary"
                        block
                        icon={<LoginOutlined />}
                        style={{ backgroundColor: '#1677ff', borderColor: '#1677ff' }}
                        onClick={() => window.location.href = '/app'}
                    >
                        Войти
                    </Button>

                    <Space direction="horizontal" style={{ justifyContent: 'center', width: '100%' }}>
                        <Button type="link" onClick={() => window.location.href = '/reset'}>
                            Забыли пароль?
                        </Button>
                        <Button type="link" onClick={() => window.location.href = '/reg'}>
                            Регистрация
                        </Button>
                    </Space>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;
