import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Card } from 'antd';

const { Title, Text } = Typography;

const Registration: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Registration form values:', values);
        // TODO: send values to backend
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Col xs={22} sm={16} md={12} lg={8}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Title level={2} style={{ textAlign: 'center' }}>Регистрация</Title>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Введите email!' }, { type: 'email', message: 'Неверный формат email!' }]}
                        >
                            <Input placeholder="Введите ваш email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[{ required: true, message: 'Введите пароль!' }, { min: 6, message: 'Минимум 6 символов' }]}
                        >
                            <Input.Password placeholder="Введите пароль" />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            label="Подтвердите пароль"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Подтвердите пароль!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Пароли не совпадают!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Повторите пароль" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Text type="secondary">
                                Уже есть аккаунт? <a href="/login">Войти</a>
                            </Text>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Registration;